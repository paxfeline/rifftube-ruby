class Riff < ApplicationRecord
    belongs_to :user
    belongs_to :video
    has_and_belongs_to_many :riff_sets

    def audio_type
        read_attribute(:isText) ? (read_attribute(:speak) ? 2 : 3) : 1
    end
    
    def audio_type=(value)
        if value == 1
            write_attribute(:isText, false)
            write_attribute(:speak, false)
        elsif value == 2
            write_attribute(:isText, true)
            write_attribute(:speak, true)
        elsif value == 3
            write_attribute(:isText, true)
            write_attribute(:speak, false)
        end
    end
      
end
