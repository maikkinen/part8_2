/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

const Books = ({ result, show }) => {
  if (result.loading) {
    return <div> ...getting there soon...</div>
  }

  if (!show) {
    return null
  }

  const books = result.data.allBooks

  console.log('books: ', books)

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books