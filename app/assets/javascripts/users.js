
$(document).ready(function() {
  showShelf()
  shelvesNewForm()
  onUpdateFormSubmit()
  //backToShelves()
  onShelvesClick()


function showShelves() {
  let table = $('table#user_shelves')
  if (table.html("") || table.css('display') === "none") {
    table.css('display', 'block')
    $.get('/shelves.json', function(resp) {
      let shelves = $(resp)
      shelves.each( index => {
        table.append(`<tr onclick="showShelf(${shelves[index].id})"><td>${shelves[index].name}</td></tr>`)
      })
    })
  }
}

function onShelvesClick() {
  $('button#show_shelves').on('click', function() {
    if ($('table#user_shelves').css('display') === "none") {
      showShelves()
    } else {
      $('table#user_shelves').css('display', 'none')
    }
  })
}

function showShelf(shelfId) {
  const template = Handlebars.compile(document.getElementById("shelf-template").innerHTML)
   $.get(`/shelves/${shelfId}`, function(resp) {
     let results = template(resp)
     $('table#user_shelves').html(results)
   })
}

function backToShelves() {
  $('table#user_shelves').html("")
  showShelves()
}

function nextShelf(id) {
  var shelfId = id + 1
  $('table#user_shelves').html("")
  const template = Handlebars.compile(document.getElementById("shelf-template").innerHTML)
   $.get(`/shelves/${shelfId}`, function(resp) {
     let results = template(resp)
     $('table#user_shelves').html(results)
   })
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

function onUpdateFormSubmit() {
  $('.edit_shelved_book').submit(function(event) {
    event.preventDefault()
    shelvedBooksEditForm(this)
  })
}

function shelvedBooksEditForm(form) {
  if (event.type !== "submit") {
    event.preventDefault()
  }
    let values = $(form).serialize()
    $.ajax({
      type: 'PATCH',
      url: form.getAttribute('action'),
      data: values,
      success: function(shelvedBookJson) {
        let shelvedBook = new ShelvedBook(shelvedBookJson)
        debugger

        $(`div#book_${shelvedBook.book_id}`).remove()

        const template = Handlebars.compile(document.getElementById("edit-shelved-book-template").innerHTML)
        let results = template(shelvedBook.json)
        $(`fieldset#shelf_${shelvedBook.shelf_id}`).append(results)

        $(`div#book_${shelvedBook.book_id}`).find(`option:contains(${shelvedBook.status})`).attr('selected', 'selected')

        $(`div#book_${shelvedBookJson['book_id']}`).find(`option:contains(${shelvedBook.shelf_name})`).attr('selected', 'selected')

      }
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
