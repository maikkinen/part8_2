/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React, { useState } from 'react'

const YearForm = (props) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  //console.log("props", props.editAuthor)

  if (!props.show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()

    await props.editAuthor({ //Tää syntaksi on selvästi väärä...how to fix?
      variables: { name, year } //Tässä pitäis varmaan parseInt(year)
    })

    console.log('edit author info...')

    setName('')
    setYear('')
  }

  return (
    <div>
      <h4>Update authors</h4>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          year
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type='submit'>update</button>
      </form>
    </div>
  )
}

export default YearForm