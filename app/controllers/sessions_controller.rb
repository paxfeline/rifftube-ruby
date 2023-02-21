require 'googleauth'

class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      session[:user_id] = user.id
      flash[:notice] = "Logged in successfully."
      send_data user.as_json(except: [:riff_pic, :password_digest])
      #redirect_to user
    else
      flash.now[:alert] = "There was something wrong with your login details."
      render 'new'
    end
  end
  def create_with_token
    # ...
    print "google token"
    #print params
    #print google_login_credentials
    payload = Google::Auth::IDTokens.verify_oidc google_login_credentials, aud: "941154439836-s6iglcrdckcj6od74kssqsom58j96hd8.apps.googleusercontent.com"
    print payload
    render plain: "OK"
  end
  def destroy
    session[:user_id] = nil
    flash[:notice] = "You have been logged out."
    render plain: "OK"
    #redirect_to root_path
    #redirect_back(fallback_location: root_path)
  end


  private 
  def google_login_credentials
    params.require(:credentials)
    #params.require(:credentials).permit(:search)
  end
end
