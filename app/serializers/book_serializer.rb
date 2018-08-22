class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :genre, :page_count
end
