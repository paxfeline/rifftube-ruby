class UsersController < ApplicationController
    helper_method :obfuscate_email

    def index
      @users = User.all
    end

    def new
      @user = User.new
    end

    def create
      # check for user in the db with this email
      existing_user = User.where(email: user_params[:email])[0]
      if existing_user.nil?
        # if user doesn't exist, create a new one
        @user = User.new(user_params)
        if @user.save
          flash[:notice] = "User created."
          UserMailer.with(user: @user).new_user_email.deliver_later
          redirect_to root_url
        else
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
          render 'new'
        end
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


    private
    def user_params
      params.require(:user).permit(:name, :email, :password)
    end

    def obfuscate_email(email)
      email_parts = email.split('@')
      email_parts[0] = email_parts[0][0..3] + "***"
      @email = email_parts.join('@')
    end
end
