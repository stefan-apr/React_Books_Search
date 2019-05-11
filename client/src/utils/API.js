import axios from "axios";

export default {
  // Gets all books
  getBooks: function() {
    return axios.get("/api/books");
  },
  // Gets the book with the given id
  getBook: function(id) {
    return axios.get("/api/books/" + id);
  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/books", bookData);
  },

  searchBooks: function(title, author) {
    if(title === "" && author !== "") {
      return axios.get('https://www.googleapis.com/books/v1/volumes?q=inauthor:' + encodeURI(author) + '&key=AIzaSyAzsASdQWnLQQfovpmIHeHCJ93gDTj5vvo');
    } else if(title !== "" && author === "") {
      return axios.get('https://www.googleapis.com/books/v1/volumes?q=intitle:' + encodeURI(title) + '&key=AIzaSyAzsASdQWnLQQfovpmIHeHCJ93gDTj5vvo');
    } else {
      return axios.get('https://www.googleapis.com/books/v1/volumes?q=intitle:' + encodeURI(title) + '+inauthor:' + encodeURI(author) + '&key=AIzaSyAzsASdQWnLQQfovpmIHeHCJ93gDTj5vvo');
    }
  }
};
