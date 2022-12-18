class AddPasswordDigest < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :password_digest, :string
    #remove_index :users, :email
  end
end