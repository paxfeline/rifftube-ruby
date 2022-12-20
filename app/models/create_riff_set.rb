class CreateRiffSet < ApplicationRecord
  belongs_to :user
  belongs_to :video
  belongs_to :riffs
end
