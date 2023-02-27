require 'googleauth'

class UsersController < ApplicationController
    helper_method :obfuscate_email

    def index
      @users = User.all
    end

    def new
      @user = User.new
    end

    def create_with_token
      begin
        payload = Google::Auth::IDTokens.verify_oidc google_login_credentials, aud: "941154439836-s6iglcrdckcj6od74kssqsom58j96hd8.apps.googleusercontent.com"
        print payload
        # check for user in the db with this email
        existing_user = User.find_by(email: payload["email"].downcase!)
        if existing_user.nil?
          # if user doesn't exist, create a new one
          params[:email] = payload["email"]
          @user = User.new(user_params)
          if @user.save
            flash[:notice] = "User created."
            UserMailer.with(user: @user).new_user_email.deliver_later
            redirect_to root_url
          else
            flash.now[:notice] = "User save failed."
            render 'new'
          end
        elsif existing_user.password_digest.nil?
          # if user exists, update password
          existing_user.password_digest = BCrypt::Password.create(user_params[:password])
          @user = existing_user
          if @user.save
            flash[:notice] = "OG User created."
            UserMailer.with(user: @user).new_user_email.deliver_later
            redirect_to root_url
          else
            flash.now[:notice] = "User save failed."
            render 'new'
          end
        else
          flash.now[:notice] = "User save failed."
          render 'new'
        end
      rescue => e
        render plain: "User creation failed"
      end
    end

    def create
      # check for user in the db with this email
      existing_user = User.find_by(email: user_params[:email].downcase)
      if existing_user.nil?
        # if user doesn't exist, create a new one
        @user = User.new(user_params)
        if @user.save
          flash[:notice] = "User created."
          UserMailer.with(user: @user).new_user_email.deliver_later
          redirect_to root_url
        else
          flash.now[:notice] = "User save failed."
          render 'new'
        end
      elsif existing_user.password_digest.nil?
        # if user exists, update password
        existing_user.password_digest = BCrypt::Password.create(user_params[:password])
        @user = existing_user
        if @user.save
          flash[:notice] = "OG User created."
          UserMailer.with(user: @user).new_user_email.deliver_later
          redirect_to root_url
        else
          flash.now[:notice] = "User save failed."
          render 'new'
        end
      else
        flash.now[:notice] = "User save failed."
        render 'new'
      end
    end


    def show
      @user = User.find(params[:id])
    end

    def confirm
      uuid = params[:uuid]
      uc = UserConfirmation.find_by_id(uuid)
      @found = uc != nil
      if @found
        @user = User.find(uc.user_id)
        @user.confirmed = true
        @user.save
      end
    end



    def get_pic
      user = User.find(params[:id])
      print "get pic"
      print user.inspect
      send_data user.riff_pic, :type => "image/png", :disposition => "inline"
    end


    private
    def user_params
      params[:user][:email].downcase!
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :pic)
    end

    def obfuscate_email(email)
      email_parts = email.split('@')
      email_parts[0] = email_parts[0][0..3] + "***"
      @email = email_parts.join('@')
    end
end
