class RenameAudioType < ActiveRecord::Migration[7.0]
  def change
    rename_column :riffs, :riff_kind, :type
  end
end
