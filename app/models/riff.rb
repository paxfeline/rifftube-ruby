class Riff < ApplicationRecord
    belongs_to :user
    belongs_to :video
    has_and_belongs_to_many :riff_sets
end
