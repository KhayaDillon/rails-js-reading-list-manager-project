
$(document).ready(function() {
  showShelves()
  showBooks()
})

function showShelves() {
  $('#show_shelves').on('click', function() {
    console.log("Hit")
    $.get('/shelves.json', function(resp) {
      let shelves = $(resp)
      shelves.each( index => {
        $('table').append(`<tr onclick="showBooks(${shelves[index].id})"><td>${shelves[index].name}</td></tr>`) 
      })
    })
  })
}

function showBooks(shelfId) {
  const template = Handlebars.compile(document.getElementById("shelf-template").innerHTML);
  console.log(shelfId)

  $.get(`/shelves/${shelfId}`, function(resp) {
    console.log(resp)
  //   const shelf = $(resp)
  //   const results = template(shelf)
  //    $('table').html(result)
  })
}