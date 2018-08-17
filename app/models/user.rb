class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: [:facebook]

  has_many :shelves
  has_many :shelved_books, through: :shelves
  has_many :books, through: :shelved_books
  validates :name, presence: true

  after_create do |user|
    user.create_default_shelves
  end

  def create_default_shelves
    self.shelves.create(name: "Reading")
    self.shelves.create(name: "Finished Reading")
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      parse_name(user, auth.info.name)
      #user.name = auth.info.name   # assuming the user model has a name
      # If you are using confirmable and the provider(s) you use validate emails, 
      # uncomment the line below to skip the confirmation emails.
      #user.skip_confirmation!
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  def has_book?(title)
    self.books.any? { |book| book.title == title }
  end

  def has_shelf?(shelf)
    self.shelves.any? { |user_shelf| user_shelf.name == shelf.name }
  end

  def pages_read
    n = 0
    self.shelved_books.each do |book|
      n += book.current_page
    end 
    n
  end

  def possessive
    possessive = self.name + ('s' == self.name[-1,1] ? "'" : "'s")
  end

private
  def self.parse_name(user, name)
    name_arr = name.split(“ “)
    user.last_name = name_arr.pop
    user.first_name = name_arr.join(“ “)
  end

end
