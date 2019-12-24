/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import YearForm from './components/YearForm'

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
  }
}
`

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const CREATE_BOOK = gql`
mutation addBook($title: String!, $published: Int, $author: String, $genres: [String]) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    author
    published
    genres
    id
  }
}
`

const SET_BIRTHYEAR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    setBornTo
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState('')

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const authors = useQuery(ALL_AUTHORS)
  console.log('authors in App: ', authors )
  const books = useQuery(ALL_BOOKS)

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS }]
  })

  const [editAuthor] = useMutation(SET_BIRTHYEAR)

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} result={authors} />

      <Books show={page === 'books'} result={books}/>

      <NewBook show={page === 'books'} addBook={addBook} />
      
      <YearForm show={page === 'authors'} editAuthor={editAuthor} />

    </div>
  )
}

export default App