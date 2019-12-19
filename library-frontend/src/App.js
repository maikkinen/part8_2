import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Query, ApolloConsumer } from 'react-apollo'
import { gql } from 'apollo-boost'


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

const App = () => {
  const [page, setPage] = useState('authors')

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

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App