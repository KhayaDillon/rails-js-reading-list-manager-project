class ShelvedBookSerializer < ActiveModel::Serializer
  attributes :id, :shelf_id, :book_id, :current_page, :status
  has_many :books
end
