class UsersController < ApplicationController
    def index
      @users = User.all
    end
    def new
      @user = User.new
    end
    def create
      debugger
      # check for user in the db with this email
      existing_user = User.where(email: user_params[:email])
      if existing_user.nil?
        # if user doesn't exist, create a new one
        @user = User.new(user_params)
      else
        # if user exists, add password
        existing_user.password = user_params[:password]
        @user = existing_user
      end
      if @user.save
        flash[:notice] = "User created."
        redirect_to root_path
      else
        render 'new'
      end
    end
    def show
      @user = User.find(params[:id])
    end
    private
    def user_params
      params.require(:user).permit(:name, :email, :password)
    end

end
