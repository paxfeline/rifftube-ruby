require 'streamio-ffmpeg'

class RiffsController < ApplicationController
    # not needed because disabled for whole app
    #skip_before_action :verify_authenticity_token

    # GET	/photos	photos#index	display a list of all photos
    # URL: GET /riffs?video_id=xxx[&user_id={"self", yyy}]
    def index
        user = params[:user_id]
        video = params[:video_id]
        if user.present? and video.present?
            if user == "self"
                if logged_in?
                    riffs = current_user.videos.find_by(url: video)&.riffs.as_json&.each { |r| r.delete("audio") }
                    render json: (riffs or [])
                else
                    render plain: "Not logged in", status: :unauthorized
                end
            else
                riffs = User.find(params[user]).videos.find_by(url: video)&.riffs.as_json&.each { |r| r.delete("audio") }
                render json: (riffs or [])
            end
        elsif video.present?
            riffs = Video.find_by(url: video)&.riffs.as_json&.each { |r| r.delete("audio") }
            render json: (riffs or [])
        else
            render plain: "Unable to load riffs", status: :internal_server_error
        end 
    end

    #   GET	/photos/new	photos#new	return an HTML form for creating a new photo
    def new
        @video_id = params[:video_id]
        render layout: false
    end

    # POST	/photos	photos#create	create a new photo
    def create
        # check if logged in

        if logged_in?

            recode_audio
            params[:riff][:user_id] = current_user.id
            params[:riff][:video_id] = Video.find_by(url: params[:riff][:video_id]).id
            
            print riff_params.inspect

            @riff = Riff.new(riff_params)

            if @riff.save
                render json: @riff, except: :audio
            else
                render plain: "Error saving riff", status: :internal_server_error
            end

        else
            render plain: "Not logged in", status: :unauthorized
        end
    end

    #  GET	/photos/:id	photos#show	display a specific photo
    def show
        riff = Riff.find(params[:id])
        send_data riff.audio
    end

    # GET	/photos/:id/edit	photos#edit	return an HTML form for editing a photo
    # URL: riffs/:id/edit
    def edit
        @id = params[:id]
        @riff = Riff.find(@id)
        render layout: false
    end

    # PATCH	/photos/:id	photos#update	update a specific photo
    # URL: PATCH /riffs/xxx[?fields=yyy[,zzz]]
    def update
        if logged_in?
            riff = Riff.find(params[:id])

            puts riff.inspect

            return render plain: "Unauthorized", status: :unauthorized if current_user.id != riff.user_id

            if params[:fields].present?
                puts params.inspect
                fields = params[:fields].split(",")
                fields.each { |field|
                    puts field
                    riff[field.to_sym] = riff_params[field.to_sym]
                }
                if riff.save
                    render json: riff, except: :audio
                else
                    render plain: "Error updating riff", status: :internal_server_error
                end
            else
                recode_audio
                if riff.update(riff_params)
                    render json: riff, except: :audio
                else
                    render plain: "Error updating riff", status: :internal_server_error
                end
            end
        else
            render plain: "Not logged in", status: :unauthorized
        end
    end

    # DELETE	/photos/:id	photos#destroy	delete a specific photo
    def destroy
    end

    def modify_start
        @id = params[:id]
        @riff = Riff.find(@id)
    end

end


private
def riff_params
  #params[:user][:email].downcase!
  params.require(:riff).permit(:audio, :text, :start, :duration, :user_id, :video_id)
end

def recode_audio
    movie = FFMPEG::Movie.new(params[:riff][:audio].tempfile.path)
    riff_path = "#{Rails.root}/tmp/riff-#{current_user.id}-#{Time.now.to_i}.mp4"
    movie.transcode(riff_path) 
    mp4data = File.read(riff_path)
    params[:riff][:audio] = mp4data 
end