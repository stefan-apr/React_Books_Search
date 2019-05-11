import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, FormBtn } from "../components/Form";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Books extends Component {

  state = {
    books: [],
    title: "",
    author: "",
    synopsis: "",
    chosenBook: null,
    incomingBooks: []
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  allowTime = function(bookSuggestions) {
    // eslint-disable-next-line
    timePass = timePass.bind(this);
    async function timePass() {
      await sleep(500);
      this.setSuggestions(bookSuggestions);
    }
    timePass();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      chosenBook: null
    });
  };

  setSuggestions = function(bookSuggestions) {
    this.setState( {
      incomingBooks: bookSuggestions
    });
    // console.log(this.state.incomingBooks);
  }

  handleKeyUp = event => {
    var bookSuggestions = [];
    if(this.state.author !== null && this.state.title !== null) {  
      API.searchBooks(this.state.title, this.state.author)
        .then(function(res) {
          console.log(res);
          if(res.data.totalItems === 0) {
            return;
          }
          for(let i = 0; i < res.data.items.length; i++) {
            if(res.data.items[i].volumeInfo.authors !== undefined && res.data.items[i].volumeInfo.description !== undefined) {
              bookSuggestions.push(res.data.items[i]);
            }
          }
        })
        .catch(err => console.log(err));
    }
    this.allowTime(bookSuggestions);
  }

  handleChoose = event => {
    event.preventDefault();
    if (this.state.title && this.state.author) {
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        synopsis: this.state.synopsis,
        link: this.state.chosenBook.volumeInfo.infoLink
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    }
    console.log(this.state.synopsis);
  };

  handlePick = function(book) {
    // console.log(book);
    this.setState({
      chosenBook: book,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors[0],
      synopsis: book.volumeInfo.description
    });
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                onKeyUp={this.handleKeyUp}
                name="title"
                placeholder="Title (required)"
              />
              <Input
                value={this.state.author}
                onChange={this.handleInputChange}
                onKeyUp={this.handleKeyUp}
                name="author"
                placeholder="Author (required)"
              />
              <div id="suggestion-list">
                {this.state.incomingBooks.map(book => (
                  <div className="prediction-buttons" onClick={() => this.handlePick(book)} key={book.id} data-link={book.volumeInfo.infoLink}
                  data-title={book.volumeInfo.title} data-authors={book.volumeInfo.authors.toString()}>
                  {book.volumeInfo.title + ", by "}
                  {book.volumeInfo.authors[0]}<br></br>  
                  <a href={book.volumeInfo.infoLink}>Google Play Store: {book.volumeInfo.infoLink}</a>
                  </div>
                ))}
              </div>
              <FormBtn
                disabled={!(this.state.chosenBook)}
                onClick={this.handleChoose}
              >
                Choose Book
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
