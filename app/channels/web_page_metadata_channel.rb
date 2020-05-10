class WebPageMetadataChannel < ApplicationCable::Channel  
    include WebPageMetadataChannelHelper

    def subscribed
        if params[:session_id] == nil || params[:session_id] == ''
            puts('invalid')
        end
        puts("hello im subscribed")
        puts(params)
        stream_from(channel_name(params[:session_id]))
    end
end  