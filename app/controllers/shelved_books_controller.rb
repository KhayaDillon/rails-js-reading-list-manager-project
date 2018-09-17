class ShelvedBooksController < ApplicationController

  def create
    shelved_book = ShelvedBook.new(shelved_book_new_hash)
    if current_user.has_book?(shelved_book.title)
      redirect_to books_path, notice: "You already have this book."
    else
      BookShelfOrganizer.take_out(shelved_book)

      redirect_to user_shelves_path(current_user)
    end
  end

  def show
    shelved_book = ShelvedBook.find(params[:id])
    render json: shelved_book
  end


  def update
    shelved_book = ShelvedBook.find(params[:id])
    old_stats = shelved_book.dup
    shelved_book.update(shelved_book_params)

    book_info = {updated: shelved_book, old: old_stats, owner: current_user}

    BookShelfOrganizer.status_change_from_fin_shelf(book_info)

    BookShelfOrganizer.shelf_set_to_read_with_fin_status(book_info)

    BookShelfOrganizer.shelf_set_to_fin(book_info)

    BookShelfOrganizer.set_status(book_info)

    if shelved_book
      shelved_book.save
    end

    render json: shelved_book, status: 200
    #redirect_to user_shelves_path(current_user)
  end

  private
    def shelved_book_new_hash
      shelf = Shelf.find(params[:shelved_book][:shelf_id])
      book = Book.find(params[:shelved_book][:book_id])
      book_copy = book.dup
      book_copy.save
      {shelf_id: shelf.id, book_id: book_copy.id}
    end

    def shelved_book_params
      params.require(:shelved_book).permit(:shelf_id, :book_id, :current_page, :status)
    end

end
