Rails.application.routes.draw do
  get 'rifftube/index'
  get 'rifftube/riff'
  get 'riff/:video_id', to: "rifftube#riff"

  get "signup", to: "users#new"
  get "login", to: "sessions#new"
  post "login", to: "sessions#create"
  delete "logout", to: "sessions#destroy"

  resources :users, except: [:new]
  resources :riffs

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "rifftube#index"
end
