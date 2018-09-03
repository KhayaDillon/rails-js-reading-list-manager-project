JS Reading List Manager

  Criteria
Via jQuery and an Active Model Serialization...

Must render at least one index resource
  -user's shelves
Must render at least one show resource (ex, Next link)
  -shelf show page
Must reveal at least one has-many relationship
  -shelf has many shelved_books

Must use a form to create a resource and render the response without a page refresh (can use Template Literals)
  -shelves create
  -books update

Must translate the JSON responses into Javascript Model Objects, which must have at least one method on the prototype.
  -Shelved_books and Book Shelf Organizer

To Do
  Create user page
    x-show currently reading and finished books
    x-transfer amount of books out and pages read to it
    x-Shelves link. Show shelves with table
    x-Click a shelf and table dissappears, shelf name and all books display, next button and back button

  Shelves create form
    x-submit form without loading

  Shelved_books update form
    -submit form without loading
    x-use JS class for shelved_book pages_left and books method

  Delete Facebook Omniauth
    x

  Issues
    x-move from finished reading shelf to fantasy shelf, doesn't appear
    x-trying to move to different shelves twice, shows json instead
    x-shelves table, clicking shelf name doesn't show shelf
    x-click shelves twice to make it disappear
    x-shelves, click twice, table doesn't show twice
    x-shelves initially show without click
    x-notices don't show until reload, have to make alerts

  x-Makes use of ES6 features as much as possible(e.g Arrow functions, Let & Const, Class, constructor functions)
