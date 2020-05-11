class WebPageMetadata < ApplicationRecord
    has_many :image_metadata
    validates(:url, url: { message: "The url passed in is invalid" })
    enum processing_status: [ :in_progress, :failed, :completed ]
end
