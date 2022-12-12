require 'streamio-ffmpeg'

class RiffsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
        print(params[:blob].tempfile)
        movie = FFMPEG::Movie.new(params[:blob].tempfile)
        debugger
        print(movie)

        movie.transcode("/tmp/movie.mp4") 
        
        @riff = Riff.new(audio_datum: movie)
    end
end
