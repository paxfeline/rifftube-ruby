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

    Zip::OutputStream.open(zipfile.path) { |zos| }

    Zip::File.open(zipfile.path, create: true) do |zf|
      riffs.each do |riff|
        zf.get_output_stream("riff" + riff.id.to_s + ".mp3") { |f| f.write riff.audio_datum.to_s }
      end
    end

    zip_data = File.read(zipfile.path)

    send_data zip_data
  end
end
