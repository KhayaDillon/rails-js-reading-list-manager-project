class ShelfSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :books
  has_many :shelved_books
end
