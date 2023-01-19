class UserMailer < ApplicationMailer
    def new_user_email
        @user = params[:user]
    
        mail(to: "grokprogramming@gmail.com", subject: "You got it!")
      end    
end
