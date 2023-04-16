class Riff < ApplicationRecord
    belongs_to :user
    belongs_to :video
    has_and_belongs_to_many :riff_sets

    attribute :audio_type, :integer

    def audio_type
        self[:audio_type]
    end

    def audio_type
        read_attribute(:isText) ? (read_attribute(:speak) ? 2 : 3) : 1
    end
    
    def audio_type=(value)
        self.inspect
        if value == 1
            self.isText = false
            self.speak = false
            #write_attribute(:isText, false)
            #write_attribute(:speak, false)
        elsif value == 2
            self.isText = true
            self.speak = true
            #write_attribute(:isText, true)
            #write_attribute(:speak, true)
        elsif value == 3
            self.isText = true
            self.speak = false
            #write_attribute(:isText, true)
            #write_attribute(:speak, false)
        end
    end
      
end
