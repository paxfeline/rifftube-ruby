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
    riffs.each_with_index do |riff, ind|
      file = Tempfile.new(binmode: true)
      file.write(riff.audio_datum.to_s)
      file.close()
      puts "d=#{riff.start_time - cursor}"
      if riff.start_time - cursor < 0 then
        break
      end
      if cursor == 0 then
        # this should always happen first
        `ffmpeg -y -i #{file.path} -filter_complex "aevalsrc=exprs=0:d=#{riff.start_time}[silence], [silence] [0:a] concat=n=2:v=0:a=1[outa]" -map [outa] /tmp/mixing#{ind.to_s}.mp4`
      else
        `ffmpeg -y -i /tmp/mixing#{ind - 1}.mp4 -i #{file.path} -filter_complex "aevalsrc=exprs=0:d=#{riff.start_time - cursor}[silence], [0:a] [silence] [1:a] concat=n=3:v=0:a=1[outa]" -map [outa] /tmp/mixing#{ind}.mp4`
      end
      last = ind
      cursor = riff.start_time + riff.duration
      puts cursor.to_s
    end
    single_data = File.read('/tmp/mixing#{last}.mp4');
    send_data single_data
  end
end
