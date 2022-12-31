require 'tempfile'
require 'zip'

class RifftubeController < ApplicationController
  def index
  end
  def riff
    @video = Video.find(params[:video_id])
  end
  def riff_zip
    video = Video.where(url: params[:video_id]).first
    user = User.find(params[:user_id])
    riffs = Riff.where(user_id: user.id, video_id: video.id)

    zipfile = Tempfile.new('rifftube')
    zipfile.close

    Zip::File.open(zipfile.path, create: true) do |zf|
      riffs.each do |riff|
        zf.get_output_stream("riff" + riff.id.to_s + ".mp4") { |f| f.write riff.audio_datum.to_s }
      end
    end

    zip_data = File.read(zipfile.path)

    send_data zip_data
  end
  def riff_single_file
    video = Video.where(url: params[:video_id]).first
    user = User.find(params[:user_id])
    riffs = Riff.where(user_id: user.id, video_id: video.id)

    download = Download.new
    download.status = "Creating file"
    download.save
    @id = download.id

    render :riff_single_file

    RiffTrack = Struct.new(:cursor, :riffs)

    Thread.new do
      Rails.application.executor.wrap do
        
        # pick out audio riffs and sort by start time
        riffs = riffs.filter { |e| !e.isText }
        riffs = riffs.sort_by(&:start_time)

        # concatenate silence and riffs

        cursor = 0
        last_file = 0
        file_ind = 0

        while riffs.length > 0
          riff_track = [RiffTrack.new(cursor, [riffs.shift()])]
          track_N = 1 # tracks with riff_tracks

          # get at least 20 riffs, or as many as are left
          i = 0
          while i < 20 && riffs.length > 0
            r = riffs.shift()
            # starting with track 0, skip tracks where r won't fit
            # if none work, make a new one
            j = 0
            while j < track_N and r.start_time < riff_track[j].cursor
              j += 1
            if j < track_N
              riff_track[j].riffs.push(r)
              riff_track[j].cursor = r.start_time + r.duration
            else
              new_track = RiffTrack.new(r.start_time + r.duration, [r])
              riff_track.push(new_track)
              track_N += 1
            end
            i += 1
          end

          # check for riffs that should be left for the next file too
          c = 0
          for i in track_N.downto(1)
            r = riff_track[i].riffs.last
            if r.start_time + r.duration > riff_track[0].cursor
              riffs.unshift(r)
              c += 1
            end
          end

          # check for additional riffs that need to be included
          # this should be changed so that these riffs are also included
          # on the next file / riff set
          i = c
          while i < riffs.length and riffs[i].start_time < riff_track[0].cursor
            r = riffs[i]
            if r.start_time + riff.duration <= riff_track[0].cursor
              riffs.delete_at(i)
            else
              i += 1
            end
            j = 1
            while r.start_time < riff_track[j].cursor and j < track_N
              j += 1
            if j < track_N
              riff_track[j].riffs.push(r)
              riff_track[j].cursor = r.start_time + r.duration
            else
              new_track = RiffTrack.new(r.start_time + r.duration, [r])
              riff_track.push(new_track)
              track_N += 1
            end
          end

          # use files and  info to generate commands for each track
          input_files = ""
          silences = [[""]] * track_N
          seqs = [[""]] * track_N
          sub_curs = [cursor] * track_N
          track_commands = ""
          mix_inputs = ""
          g_ind = 0
          for j in 0..track_N
            riffs_slice[j].each_with_index do |riff, ind|
              file = Tempfile.new(binmode: true)
              file.write(riff.audio_datum.to_s)
              file.close()

              input_files << " -i #{file.path}"
              silences[j] << "aevalsrc=exprs=0:d=#{riff.start_time - sub_curs[j]}[silence#{j}#{ind}], "
              seqs[j] << "[silence#{j}#{ind}] [#{g_ind}:a] "
              sub_curs[j] = riff.start_time + riff.duration
              g_ind += 1
            end

            n = riffs_slice[j].count * 2 # silence + riff
            track_commands << "#{silences[j]}#{seqs[j]}concat=\
              n=#{file_ind == 0 ? n : n + 1}:v=0:a=1[out#{track_N == 1 ? "" : j}a]; "
            mix_inputs << "[out#{j}a]"
          end

          # the first track (0) determines how long this current segment runs
          cursor = sub_curs[0]

          for i in 0..track_N do
            puts input_files[i]
            puts silences[i]
            puts seqs[i]
            puts "====="
          end

          #`ffmpeg -y -i #{file.path} -filter_complex "aevalsrc=exprs=0:d=#{riff.start_time}[silence], [silence] [0:a] concat=n=2:v=0:a=1[outa]" -map [outa] /tmp/mixing#{ind.to_s}.mp4`
          #`ffmpeg -y #{input_files[i]} \
          #  -filter_complex "#{silences}#{seqs}concat=n=#{n}:v=0:a=1[outa]" -map [outa] \
          #  #{Rails.root}/tmp/mixing#{file_ind}.mp4`
          `ffmpeg -y \
            #{file_ind == 0 ? "" :
              "-i #{Rails.root}/tmp/mixing#{file_ind - 1}.mp4 "} \
            #{input_files[i]} \
            -filter_complex "#{track_commands} \
            #{track_N == 1 ? '"' :
              "#{mix_inputs}amix=inputs=#{track_N}:duration=first:dropout_transition=0:normalize=0[outa]\""} \
            -map [outa] #{Rails.root}/tmp/mixing#{file_ind}.mp4`

          last_file = file_ind
          file_ind = file_ind + 1
        end
        single_data = File.read("#{Rails.root}/tmp/mixing#{last_file}.mp4");
        download.data = single_data
        download.status = "File ready"
        download.save
      end
    end
  end
  def download
    download = Download.find(params[:id])
    if download.data.nil?
      @status = download.status
      render :download
    else
      send_data download.data
    end
  end
end
