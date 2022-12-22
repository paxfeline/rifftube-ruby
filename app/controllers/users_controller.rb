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
          redirect_to root_path
        else
          render 'new'
        end
      elsif existing_user.password_digest.nil?
        # if user exists, add password
        @user = existing_user.dup
        @user.password = user_params[:password]
        if @user.save
          flash[:notice] = "OG User created."
          # put in a transaction and the unique constraint could be left in place
          Riff.where(user_id: existing_user.id).update_all :user_id => @user.id
          existing_user.delete
          redirect_to root_path
        else
          render 'new'
        end
      end
    end
    def show
      @user = User.find(params[:id])
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
