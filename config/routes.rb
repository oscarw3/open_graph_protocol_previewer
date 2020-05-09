Rails.application.routes.draw do
  root 'open_graph_previewer#index'
  get 'open_graph_previewer/index'
  get 'open_graph_previewer/process_image'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
