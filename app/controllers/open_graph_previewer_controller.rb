class OpenGraphPreviewerController < ApplicationController
  def index; end

  def start_processing
    # simple validation, more validation done later
    if params["url"] == nil
      render(json: {"text": "no url provided", "status": 400})
      return
    end

    url = params["url"]
    @web_page_metadata = WebPageMetadata.find_by(url: url)
    if @web_page_metadata == nil
      @web_page_metadata = WebPageMetadata.create(url: url)
    end
    render(json: {"text": "success", "status": 200})
  end
end
