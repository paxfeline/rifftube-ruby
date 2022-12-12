class CreateRiffs < ActiveRecord::Migration[7.0]
  def change
    create_table :riffs, if_not_exists: true do |t|
      t.binary :audio_datum
      t.float :duration
      t.float :start_time
      t.text :text
      t.integer :rating
      t.boolean :isText
      t.integer :user_id
      t.integer :video_id

      t.timestamps
    end
  end
end
