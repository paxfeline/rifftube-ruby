class NotifChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "video:#{params[:video_id]}"
  end

  def receive(data)
    ActionCable.server.broadcast("video:#{params[:video_id]}", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
