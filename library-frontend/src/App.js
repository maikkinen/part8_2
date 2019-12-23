import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { Query, ApolloConsumer, Mutation } from 'react-apollo'
import { useQuery, useMutation, useApolloClient, getDataFromTree } from '@apollo/react-hooks'
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

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <ApolloConsumer>
        {(client =>
          <Query query={ALL_AUTHORS}>
            {(result) => <Authors
              show={page === 'authors'} result={result} client={client}
            />}
          </Query>
        )}
      </ApolloConsumer>

      <ApolloConsumer>
        {(client =>
          <Query query={ALL_BOOKS}>
            {(result) => <Books
              show={page === 'books'} result={result} client={client}
            />}
          </Query>
        )}
      </ApolloConsumer>

      <Mutation
        mutation={CREATE_BOOK} //Tällä pelityylillä kirjailijalista ei päivity, jos lisätään uusi teos. Not najs!
        refetchQueries={[{ query: ALL_BOOKS }]}
        onError={handleError}> 
        {(addBook) =>
          <NewBook
            addBook={addBook} show={page === 'add'}
          />}
      </Mutation>

      <Mutation
        mutation={SET_BIRTHYEAR}>
          {(editAuthor) => 
          <YearForm
            editAuthor={editAuthor} show={page === 'authors'}
          />}

        </Mutation>
    </div>
  )
}

export default App