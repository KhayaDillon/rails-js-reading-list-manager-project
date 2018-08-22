
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
 
    let patch = $.ajax({
      type: 'PATCH',
      url: this.getAttribute('action'),
      data: values,
      success: function(shelvedBook) {
        alert("Success")

        $.get(`/shelves/${shelvedBook['shelf_id']}`, function(shelf) {
          const template = Handlebars.compile(document.getElementById("edit-shelved-book-template").innerHTML)
          let results = template(shelf)
          $(`fieldset#${shelf['id']}`).append(results)
        })
         
      }
    })

    
    
    //patch.done()
  })
}