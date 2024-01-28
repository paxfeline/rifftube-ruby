class AddThresholdModeToUserOptions < ActiveRecord::Migration[7.0]
  def change
    add_column :user_options, :threshold_mode, :integer
    add_column :user_options, :threshold_options, :string
  end
end
