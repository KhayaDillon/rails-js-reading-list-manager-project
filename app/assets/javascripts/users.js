
$(document).ready(function() {
  shelvesNewForm()
  onUpdateFormSubmit()
  onShelvesClick()
})

function showShelves() {
  const table = $('table#user_shelves')
  if (table.html("") || table.css('display') === "none") {
    table.css('display', 'block')
    $.get('/shelves.json', resp => {
      const shelves = $(resp)
      shelves.each( index => {
        table.append(`<tr onclick="showShelf(${shelves[index].id})"><td>${shelves[index].name}</td></tr>`)
      })
    })
  }
}

function onShelvesClick() {
  debugger
  $('button#show_shelves').on('click', () => {
    if ($('table#user_shelves').css('display') === "none") {
      showShelves()
    } else {
      $('table#user_shelves').css('display', 'none')
    }
  })
}

function showShelf(shelfId) {
  const template = Handlebars.compile(document.getElementById("shelf-template").innerHTML)
   $.get(`/shelves/${shelfId}`, resp => {
     let results = template(resp)
     $('table#user_shelves').html(results)
   })
}

function backToShelves() {
  $('table#user_shelves').html("")
  showShelves()
}

function nextShelf(id) {
  let shelfId = id + 1
  $('table#user_shelves').html("")
  const template = Handlebars.compile(document.getElementById("shelf-template").innerHTML)
   $.get(`/shelves/${shelfId}`, resp => {
     let results = template(resp)
     $('table#user_shelves').html(results)
   })
}

function shelvesNewForm() {
  $('form#new_shelf').submit(function(event) {
    event.preventDefault()

    const post = $.post('/shelves', $(this).serialize())
    post.done(function(data) {
      const template = Handlebars.compile(document.getElementById("new-shelf-template").innerHTML)
      const results = template(data)
      $('#shelves').append(results)
      if (!!data.id) $("html, body").animate({ scrollTop: $(document).height() }, "slow")
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
  if (event.type !== "submit") event.preventDefault()
  const values = $(form).serialize()
  const wantedShelfId = `shelf_${$(form).serializeArray()[5]['value']}`
  $.ajax({
    type: 'PATCH',
    url: form.getAttribute('action'),
    data: values,
    success: (shelvedBookJson) => {
      let shelvedBook = new ShelvedBook(shelvedBookJson)
      const previousShelf = $(`div#book_${shelvedBook.book_id}`).parent()
      const currentShelf = $(`fieldset#shelf_${shelvedBook.shelf_id}`)

      if (previousShelf.attr('id') === currentShelf.attr('id') && wantedShelfId !== previousShelf.attr('id')) {
        alert("Invalid Changes")
      }
      $(`div#book_${shelvedBook.book_id}`).remove()

      const template = Handlebars.compile(document.getElementById("edit-shelved-book-template").innerHTML)
      let results = template(shelvedBook.json)
      currentShelf.append(results)

      selectOption(shelvedBook.book_id, shelvedBook.status)
      selectOption(shelvedBook.book_id, shelvedBook.shelf_name)
    }
  })
}

function selectOption(book_id, attr) {
  $(`div#book_${book_id}`).find(`option:contains(${attr})`).attr('selected', 'selected')
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
