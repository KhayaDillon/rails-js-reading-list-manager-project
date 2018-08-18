
$(document).ready(function() {
  showShelves()
})

function showShelves() {
  $('#show_shelves').on('click', function() {
    $.get('/shelves.json', function(resp) {
      let shelves = $(resp)
      shelves.each( index => {
        $('tbody').append(`<tr><td>${shelves[index].name}</td></tr>`) 
      })
    })
  })
}

