class WebPageMetadata < ApplicationRecord
    has_many :image_metadata
    validates(:url, url: { message: "The url passed in is invalid" })
    enum processing_status: [ :in_progress, :failed, :completed ]

    def fail(processing_errors)
        self.processing_errors = processing_errors
        self.processing_status = "failed"
        self.save()
    end
end
