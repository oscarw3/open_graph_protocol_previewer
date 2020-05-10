module WebPageMetadataChannelHelper
    def channel_name(session_id)
        return "web_page_metadata_#{session_id}"
    end
end
