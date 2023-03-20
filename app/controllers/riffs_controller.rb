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
                    riffs = current_user.videos.find(video).riffs.as_json.each { |r| r.delete("audio") }
                    render json: riffs
                else
                    render plain: "Not logged in", status: :unauthorized
                end
            else
                riffs = User.find(params[user]).videos.find(video).riffs.as_json.each { |r| r.delete("audio") }
                render json: riffs
            end
        elsif video.present?
            riffs = Video.find(video).riffs.as_json.each { |r| r.delete("audio") }
            render json: riffs
        else
            render plain: "Unable to load riffs", status: :internal_server_error
        end 
    end

    #   GET	/photos/new	photos#new	return an HTML form for creating a new photo
    def new
        render layout: false
    end

    # POST	/photos	photos#create	create a new photo
    def create
        # check if logged in

        movie = FFMPEG::Movie.new(params[:blob].tempfile.path)

        movie.transcode("#{Rails.root}/tmp/movie.mp4") 

        mp4data = File.read("#{Rails.root}/tmp/movie.mp4")
        
        @riff = Riff.new(audio_datum: mp4data, isText: false, user_id: 1, video_id: 1)

        @riff.save
    end

    #  GET	/photos/:id	photos#show	display a specific photo
    def show
        riff = Riff.find(params[:id])
        send_data riff.audio_datum
    end

    # GET	/photos/:id/edit	photos#edit	return an HTML form for editing a photo
    # URL: riffs/:id/edit?blob_url=xxx
    def edit
        @blob_url = params[:blob_url]
        @id = params[:id]
        render layout: false
    end

    # PATCH	/photos/:id	photos#update	update a specific photo
    # URL: PATCH /riffs/xxx[?fields=yyy[,zzz]]
    def update
    end

    # DELETE	/photos/:id	photos#destroy	delete a specific photo
    def destroy
    end

end
