class CreateUserBlocks < ActiveRecord::Migration[7.0]
  def change
    create_table :user_blocks do |t|
      t.references :blocker, foreign_key: { to_table: :users }, index: true
      t.references :blockee, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
