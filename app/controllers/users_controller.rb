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
      # TODO: use ENV variable
      payload = Google::Auth::IDTokens.verify_oidc google_login_credentials, aud: "941154439836-s6iglcrdckcj6od74kssqsom58j96hd8.apps.googleusercontent.com"
      print payload
      # check for user in the db with this email
      params[:user][:email] = payload["email"].downcase!
      params[:user][:confirmed] = true
      #existing_user.confirmed = true # creation with google = auto confirmed (good idea?)
      create_helper
    rescue => e
      render plain: "User creation failed. Google auth token failed to verify.", status: :internal_server_error
    end
  end

  def create
    # check for user in the db with this email
    params[:user][:email].downcase!
    params[:user][:confirmed] = false
    create_helper
  end

  def create_helper
    existing_user = User.find_by(email: user_params[:email])
    if existing_user.nil?
      # if user doesn't exist, create a new one
      @user = User.new(user_params)
      print @user.inspect
      if @user.save
        flash[:notice] = "User created."
        UserMailer.with(user: @user).new_user_email.deliver_later
        render plain: "User created.", status: :ok
      else
        print @user.errors.full_messages
        flash.now[:notice] = "User save failed. (1) Error(s): #{@user.errors.full_messages}"
        render plain: "User save failed. (1)\nError(s): #{@user.errors.full_messages}", status: :internal_server_error
      end
    elsif existing_user.password_digest.nil?
      # if user exists, update password
      existing_user.password_digest = BCrypt::Password.create(user_params[:password])
      @user = existing_user
      if @user.save
        flash[:notice] = "OG User created."
        UserMailer.with(user: @user).new_user_email.deliver_later
        render plain: "OG User created.", status: :ok
      else
        print @user.errors.full_messages
        flash.now[:notice] = "User save failed. (2) Error(s): #{@user.errors.full_messages}"
        render plain: "User save failed. (2)\nError(s): #{@user.errors.full_messages}", status: :internal_server_error
      end
    else
      flash.now[:notice] = "User creation failed. (3) User already exists."
      render plain: "User creation failed. (3)\nUser already exists.", status: :internal_server_error
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
    user = User.find_by(id: params[:id])
    print "get pic"
    print user.inspect
    if user&.riff_pic.present?
      send_data user.riff_pic, :type => "image/png", :disposition => "inline"
    else
      send_file "#{Rails.root}/public/images/default_pic.png", :disposition => "inline"
    end
  end

  def set_pic
    if logged_in?
      user = @current_user
      #puts params[:image].inspect

      img = params[:image].tempfile
      img_data = File.read(img.path)

      user.riff_pic = img_data
      if user.save
        render plain: "Updated", status: :ok
      else
        render plain: "Error saving pic", status: :internal_server_error
      end
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def set_name
    if logged_in?
      user = @current_user
      user.name = params[:name]
      if user.save
        render plain: "Updated", status: :ok
      else
        render plain: "Error saving pic", status: :internal_server_error
      end
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def status
    if logged_in?
      render json: @current_user.to_json(except: [:riff_pic, :password_digest])
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

private
  def user_params
    #params[:user][:email].downcase!
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :riff_pic, :confirmed)
  end

  def obfuscate_email(email)
    email_parts = email.split('@')
    email_parts[0] = email_parts[0][0..3] + "***"
    @email = email_parts.join('@')
  end
end
