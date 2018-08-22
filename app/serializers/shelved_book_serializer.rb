class ShelvedBookSerializer < ActiveModel::Serializer
  attributes :id, :shelf_id, :book_id, :current_page, :status
  belongs_to :book
end
