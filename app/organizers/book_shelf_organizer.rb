class BookShelfOrganizer

  def self.take_out(book)
    if book.shelf_name == "Finished Reading"
      book.update(status: "Finished", current_page: book.page_count)
    else
      book.update(status: "Plan to Read")
    end
    book.save

    #book.current_location
  end

  def self.status_change_from_fin_shelf(book)
    #When book is on Finished shelf and only the status gets changed
    if book[:updated].shelf_name == "Finished Reading" && book[:updated].shelf_name == book[:old].shelf_name && book[:updated].status != "Finished" && book[:updated].status != "Dropped"
      #If current page has not been appropriately lowered, don't change status
      if book[:updated].current_page == book[:updated].page_count
        book[:updated].status = "Finished"
        # message[:alert] = "Your book's status is no longer finished? Then your current page can't be the last page. Please update your current page accordingly."
      #Move to Reading shelf if shelf is not given, but status and current page has been adjusted appropriately
      else
        book[:updated].set_shelf(book[:owner], "Reading")
      end
    end
  end

  def self.shelf_set_to_read_with_fin_status(book)
    #When the status has been left to Finished but the shelf has been changed to Reading
    if book[:updated].status == "Finished" && book[:updated].status == book[:old].status && book[:updated].shelf_name == "Reading"
      book[:updated].set_shelf(book[:owner], book[:old].shelf_name)
      # message[:alert] = "Books you have finished can't be put on your Reading Shelf. Please update your status and current page."
    end
  end

  def self.shelf_set_to_fin(book)
    #When user changes the shelf to Finished
    if book[:updated].shelf_name == "Finished Reading" && book[:updated].shelf_name != book[:old].shelf_name
      #If user has not altered book status
      if book[:updated].status == book[:old].status
        book[:updated].status = "Finished"
      #If the user had also altered the status, and it's not Finished
      elsif book[:updated].status != "Finished" && book[:updated].status != "Dropped"
        # message[:alert] = "You can't put a book that is not finished on your Finished Reading Shelf. Please change the book's status."
        book[:updated].set_shelf(book[:owner], book[:old].shelf_name)
      end
    end
  end

  def self.set_status(shelved_book)
    case shelved_book[:updated].status
    when "Finished"
      if shelved_book[:updated].current_page != shelved_book[:updated].page_count
        shelved_book[:updated].current_page = shelved_book[:updated].page_count
        # message[:notice] = "Books you have finished can't have pages left to read. Current page has been set to last page."
      end
      shelved_book[:updated].set_shelf(shelved_book[:owner], "Finished Reading") if shelved_book[:updated].shelf_name == "Reading"
    when "On Hold", "Currently Reading"
      if shelved_book[:updated].current_page == shelved_book[:updated].page_count
        shelved_book[:updated].set_shelf(shelved_book[:owner], shelved_book[:old].shelf_name)
        shelved_book[:updated].status = shelved_book[:old].status
        shelved_book[:updated].current_page = shelved_book[:old].current_page
        # message[:notice] = "You can't put on hold or be currently reading a book you've finished. Please update your current page."
      elsif shelved_book[:updated].current_page == 0
        shelved_book[:updated].status = "Plan to Read"
        # message[:notice] = "You can't put on hold or be currently reading a book you haven't started. Please update your current page. Status has been set to Plan to Read."
      end
    when "Plan to Read"
      if shelved_book[:updated].current_page != 0
        shelved_book[:updated].current_page = 0
        # message[:notice] = "Books you plan to read can't have a current page. Current page has been changed to zero."
      end
    when "Dropped"
      book = shelved_book[:updated].book
      shelved_book[:updated].destroy
      # message[:notice] = "#{book.title} has been removed from your shelves."
      book.delete
    end
  end

end
