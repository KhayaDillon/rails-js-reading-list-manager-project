# Specifications for the Rails with jQuery Assessment

Specs:
- [x] Use jQuery for implementing new requirements
    Uses jQuery to find DOM objects and to make Ajax requests

- [x] Include a show resource rendered using jQuery and an Active Model Serialization JSON backend.
    showShelf() function passes in a shelf id to Ajax request, which then gets the proper JSON formatted by shelf_serializer

- [x] Include an index resource rendered using jQuery and an Active Model Serialization JSON backend.
    showShelves() function makes Ajax request, which gets the proper JSON formatted by shelf_serializer

- [x] Include at least one has_many relationship in information rendered via JSON and appended to the DOM.
    A shelf has_many books, which gets rendered with shelf show resource

- [x] Use your Rails API and a form to create a resource and render the response without a page refresh.
    shelvesNewForm() function listens for submit, prevents default, and sends ajax post request by passing in the form's serialized values. JSON data is then passed into handlebars template and produced html is appended to the list of shelves.

- [x] Translate JSON responses into js model objects.
    shelvedBooksEditForm() function updates a resource without reload like above, but with patch request. After request success, an instance of ShelvedBook is created and the JSON is passed in.

- [x] At least one of the js model objects must have at least one method added by your code to the prototype.
  ShelvedBook class has pages_left() function, which is an abstracted prototype.

Confirm
- [x] You have a large number of small Git commits
- [x] Your commit messages are meaningful
- [x] You made the changes in a commit that relate to the commit message
- [x] You don't include changes in a commit that aren't related to the commit message
