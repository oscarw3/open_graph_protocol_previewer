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

    # TODO: this needs to be done async and actual parsing needs to be done
    @web_page_metadata = WebPageMetadata.find_by(url: url)
    if @web_page_metadata == nil
      @web_page_metadata = WebPageMetadata.create(url: url)
    end

    # broadcast to channel
      ActionCable.server.broadcast(channel_name(session_id),
      text: "hey whatsup hello" + url,
    )
    render(json: {"text": "success", "status": 200})
  end
end
