require 'tempfile'
require 'zip'

class RifftubeController < ApplicationController
  def index
  end
  def riff
    @video = Video.find(params[:video_id])
  end
  def riffZip
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
  def riffSingleFile
    video = Video.where(url: params[:video_id]).first
    user = User.find(params[:user_id])
    riffs = Riff.where(user_id: user.id, video_id: video.id)

    cursor = 0
    last = 0
    riffs = riffs.sort_by(&:start_time)
    file_ind = 0
    riffs.each_slice(30) do |riff_bunch|
      input_files = ""
      silences = ""
      seqs = ""
      n = riff_bunch.count * 2 # silence + riff
      riff_bunch.each_with_index do |riff, ind|
        file = Tempfile.new(binmode: true)
        file.write(riff.audio_datum.to_s)
        file.close()
        input_files << " -i #{file.path}"
        silences << "aevalsrc=exprs=0:d=#{riff.start_time - cursor}[silence#{ind}], "
        seqs << "[silence#{ind}] [#{ind}:a] "
        cursor = riff.start_time + riff.duration
      end
      #puts input_files
      puts input_files
      puts silences
      puts seqs
      puts "====="
      if file_ind == 0 then
        # this should always happen first
        #`ffmpeg -y -i #{file.path} -filter_complex "aevalsrc=exprs=0:d=#{riff.start_time}[silence], [silence] [0:a] concat=n=2:v=0:a=1[outa]" -map [outa] /tmp/mixing#{ind.to_s}.mp4`
        `ffmpeg -y #{input_files} -filter_complex "#{silences}#{seqs}concat=n=#{n}:v=0:a=1[outa]" -map [outa] #{Rails.root}/tmp/mixing#{file_ind}.mp4`
      else
        #`ffmpeg -y -i /tmp/mixing#{ind - 1}.mp4 -i #{file.path} -filter_complex "aevalsrc=exprs=0:d=#{riff.start_time - cursor}[silence], [0:a] [silence] [1:a] concat=n=3:v=0:a=1[outa]" -map [outa] /tmp/mixing#{ind}.mp4`
        `ffmpeg -y -i #{Rails.root}/tmp/mixing#{file_ind - 1}.mp4 #{input_files} -filter_complex "#{silences}#{seqs}concat=n=#{n + 1}:v=0:a=1[outa]" -map [outa] #{Rails.root}/tmp/mixing#{file_ind}.mp4`
      end
      last = file_ind
      file_ind = file_ind + 1
    end
    single_data = File.read("#{Rails.root}/tmp/mixing#{last}.mp4");
    send_data single_data
  end
end
