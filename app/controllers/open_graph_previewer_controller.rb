class OpenGraphPreviewerController < ApplicationController
  def index; end

  def process_image 
    render json: { "process": "in progress" }
  end
end
