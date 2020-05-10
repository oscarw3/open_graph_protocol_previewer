class WebPageMetadataChannel < ApplicationCable::Channel  
    include WebPageMetadataChannelHelper

    def subscribed
        if params[:session_id] == nil || params[:session_id] == ''
            logger.error("empty session_id")
            return
        end
        stream_from(channel_name(params[:session_id]))
    end
end  