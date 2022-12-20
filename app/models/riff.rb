class Riff < ApplicationRecord
    belongs_to :user
    belongs_to :riff_set
    belongs_to :video
end
