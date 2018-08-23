
$(document).ready(function() {
  showShelves()
  showBooks()
  shelvesNewForm()
  shelvedBooksEditForm()
})

function showShelves() {
  $('#show_shelves').on('click', function() {

    $.get('/shelves.json', function(resp) {
      let shelves = $(resp)
      shelves.each( index => {
        $('table').append(`<tr onclick="showBooks(${shelves[index].id})"><td>${shelves[index].name}</td></tr>`) 
      })
    })
  })
}

function showBooks(shelfId) {
  const template = Handlebars.compile(document.getElementById("shelf-template").innerHTML)
  console.log(shelfId)
  // $.get(`/shelves/${shelfId}`, function(resp) {
  //   console.log(resp)
  //   const shelf = $(resp)
  //   const results = template(shelf)
  //   $('table').html(results)
  // })
}

function shelvesNewForm() {
  $('form#new_shelf').submit(function(event) {
    event.preventDefault()

    let values = $(this).serialize()
    let post = $.post('/shelves', values)
    post.done(function(data) {
      let newShelf = data
      const template = Handlebars.compile(document.getElementById("new-shelf-template").innerHTML)
      let results = template(newShelf)
      $('#shelves').append(results)
      $("html, body").animate({ scrollTop: $(document).height() }, "slow")
    })
  })
}

function shelvedBooksEditForm() {
  $('.edit_shelved_book').submit(function(event) {
    event.preventDefault()

    let values = $(this).serialize()
 
    $.ajax({
      type: 'PATCH',
      url: this.getAttribute('action'),
      data: values,
      success: function(shelvedBookJson) {
        let shelvedBook = new ShelvedBook(shelvedBookJson)

        $(`div#book_${shelvedBook.book_id}`).remove()
 
        alert("Hit 1")
        const template = Handlebars.compile(document.getElementById("edit-shelved-book-template").innerHTML)
        alert("Hit 2")
        console.log(shelvedBookJson)
        console.log(shelvedBook.json)
        let results = template(shelvedBook.json)
        alert("Hit 3")
        $(`fieldset#shelf_${shelvedBook.shelf_id}`).append(results)
          
        $(`div#book_${shelvedBook.book_id}`).find(`option:contains(${shelvedBook.status})`).attr('selected', 'selected')

        $(`div#book_${shelvedBookJson['book_id']}`).find(`option:contains(${shelvedBook.shelf_name})`).attr('selected', 'selected')

      }
    })
  })
}

class ShelvedBook {
  constructor(shelvedBook) {
    this.json = shelvedBook
    this.status = shelvedBook['status']
    this.shelf_id = shelvedBook['shelf_id']
    this.book_id = shelvedBook['book_id']
    this.shelf_name = shelvedBook['shelf']['name']
    this.page_count = shelvedBook['book']['page_count']
    this.current_page = shelvedBook['current_page']
  }

  pages_left() {
    return this.page_count - this.current_page
  }
}

Handlebars.registerHelper('pages_left', function(shelvedBookJson) {
  let shelvedBook = new ShelvedBook(shelvedBookJson)
  return shelvedBook.pages_left()
})