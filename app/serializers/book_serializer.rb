class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :genres
end
