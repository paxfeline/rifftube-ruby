require "bcrypt"

class User < ApplicationRecord
    has_secure_password
    
    has_many :riffs
    has_many :videos, through: :riffs
    
end
