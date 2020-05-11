class WebPageMetadataChannel < ApplicationCable::Channel  
    include WebPageMetadataChannelHelper

    def subscribed
        if params[:web_page_url] == nil || params[:web_page_url] == ''
            logger.error("no web_page_url provided to subscription")
            return
        end
        stream_from(channel_name(params[:web_page_url]))
    end
end  