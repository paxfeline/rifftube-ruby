Rails.application.routes.draw do
  get 'rifftube/index'
  get 'rifftube/riff'
  get 'riff/:video_id', to: "rifftube#riff"

  get 'riffs/video/:video_id/user/:user_id', to: "rifftube#riff_zip"
  get 'riffs/video/:video_id/user/:user_id/single', to: "rifftube#riff_single_file"
  get 'download/:id', to: "rifftube#download"

  get "signup", to: "users#new"
  post "signup-with-google", to: "users#create_with_token"
  get "login", to: "sessions#new"
  post "login", to: "sessions#create"
  post "login-with-google", to: "sessions#create_with_token"
  delete "logout", to: "sessions#destroy"

  get "send_email", to: "rifftube#send_email"
  get "user/confirm/:uuid", to: "users#confirm"

  get "riffer-pic/:id(.:format)", to: "users#get_pic"

  resources :users, except: [:new]
  resources :riffs

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "rifftube#index"
end
