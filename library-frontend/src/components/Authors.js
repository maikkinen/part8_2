/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import React, { useState  } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

const Authors = ({ props, result }) => {
  //const client = useApolloClient()
  //const [authors, setAuthors] = useState(null)

  //const authors = [] //result.data

  console.log('result: ', result.data)
  //console.log('result.allAuthors: ', result.data.allAuthors )

  const authors = props.data.authors

  if (props.loading) {
    return <div> ..loading </div>
  }

  //console.log('authors: ', authors)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born in
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Authors