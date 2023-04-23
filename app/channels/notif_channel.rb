class NotifChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    puts "subbed video:#{params[:video_id]}"
    stream_from "video:#{params[:video_id]}"
  end

  def receive(data)
    puts "cable data received"
    puts data
    #ActionCable.server.broadcast("video:#{Video.find(params[:video_id].url)}", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
