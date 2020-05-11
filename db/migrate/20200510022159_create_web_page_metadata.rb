class CreateWebPageMetadata < ActiveRecord::Migration[6.0]
  def change
    create_table :web_page_metadata do |t|
      t.string :url
      t.string :image_url
      t.integer :processing_status, default: 0
      t.string :processing_errors, array: true, default: []
      t.timestamps
    end
  end
end
