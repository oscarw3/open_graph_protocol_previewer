Rails.application.routes.draw do

  # Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'

  root 'open_graph_previewer#index'
  get 'open_graph_previewer/index'
  post 'open_graph_previewer/start_processing'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
