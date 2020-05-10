class OpenGraphPreviewerController < ApplicationController
  include WebPageMetadataChannelHelper

  def index; end

  def start_processing
    # simple validation, more validation done later
    if params["url"] == nil || params["url"] == ""
      render(json: {"text": "no url provided", "status": 400})
      return
    end

    if params["session_id"] == nil || params["session_id"] == ""
      render(json: {"text": "no session_id provided", "status": 400})
      return
    end

    url = params["url"]
    session_id = params["session_id"]

    process_url(url, session_id)
    puts("rendering") # For testing asynchronous
    render(json: {"text": "success", "status": 200})
  end

  def process_url(url, session_id)
    Thread.new do
      sleep(3.seconds)  # For testing asynchronous
      # TODO: this needs to be done async and actual parsing needs to be done
      @web_page_metadata = WebPageMetadata.find_by(url: url)
      if @web_page_metadata == nil
        @web_page_metadata = WebPageMetadata.create(url: url)
      end
  
      # broadcast to channel
        ActionCable.server.broadcast(channel_name(session_id),
        url: url,
      )
      puts("thread done") # For testing asynchronous
    end
  end
end
