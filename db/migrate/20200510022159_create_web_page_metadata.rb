class CreateWebPageMetadata < ActiveRecord::Migration[6.0]
  def change
    create_table :web_page_metadata do |t|
      t.string :url
      t.string :image_url

      t.timestamps
    end
  end
end
