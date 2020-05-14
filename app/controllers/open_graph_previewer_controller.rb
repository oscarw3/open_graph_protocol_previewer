class OpenGraphPreviewerController < ApplicationController
  include WebPageMetadataChannelHelper

  def index; end

  def start_processing
    # no need to broadcast since there's no url, return bad request
    # client side should handle this case
    if params["url"] == nil || params["url"] == ""
      render(json: {}, status: 400)
      return
    end
    url = params["url"]
    
    @web_page_metadata = WebPageMetadata.find_by(url: url)
    if @web_page_metadata != nil  # already been parsed or being parsed, can return
      broadcast(@web_page_metadata)
      render(json: {}, status: 200)
      return
    end

    @web_page_metadata = WebPageMetadata.create(url: url, processing_status: "in_progress")
    if !@web_page_metadata.errors.messages.empty? # return if there are validation errors
      @web_page_metadata.fail([])
      broadcast(@web_page_metadata)
      render(json: {}, status: 404)
      return
    end
    broadcast(@web_page_metadata)

    process_url(url)
    render(json: {}, status: 200)
  end

  def process_url(url)
    Thread.new do
      # sleep(2.seconds)  # For testing asynchronous

      # open graph protocol checking
      begin
        response = Faraday.get(url)
      rescue Faraday::ConnectionFailed => e
        @web_page_metadata.fail(["unable to connect to website", e])
        broadcast(@web_page_metadata)   
        Thread.exit()
      end
      
      if response.status != 200 || response.body == ''
        @web_page_metadata.fail(["request to website failed"])
        broadcast(@web_page_metadata)  
        Thread.exit()
      end

      begin
        open_graph = OGP::OpenGraph.new(response.body)
      rescue OGP::MissingAttributeError, OGP::MalformedSourceError => e
        @web_page_metadata.fail(["website is not open graph compliant", e])
        broadcast(@web_page_metadata)
        Thread.exit()   
      end

      image_url = open_graph.data["image"]  # assuming it's a single image per site, multiple images will return an array
      if image_url == nil
        @web_page_metadata.fail(["website does not have an open graph image"])
        broadcast(@web_page_metadata.url)
        Thread.exit()   
      end

      @web_page_metadata.image_url = image_url
      @web_page_metadata.processing_status = "completed"
      @web_page_metadata.save()
      broadcast(@web_page_metadata)
    end
  end

  def broadcast(web_page_metadata)
    # broadcast to channel
    ActionCable.server.broadcast(channel_name(web_page_metadata.url),
      web_page_url: web_page_metadata.url,
      image_url: web_page_metadata.image_url,
      processing_status: web_page_metadata.processing_status,
      errors: web_page_metadata.errors.messages.values + web_page_metadata.processing_errors,
    )  
  end
end
