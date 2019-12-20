const { ApolloServer, gql } = require('apollo-server')
const uuid = require('uuid/v1')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodore Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * It would be more sensible to assosiate book and the author by saving 
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodore Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Diamond',
    published: 1872,
    author: 'Fyodore Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]


//8.1 bookCount ja authorCount
//8.2 allBooks
//8.3 allAuthors
const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int 
    bookCount: Int
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int
      genres: [String]
      id: ID
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }

  type Book {
    title: String!
    author: String
    published: Int
    genres: [String]
    id: ID!
  }

  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author!]!
    
  }
`
const resolvers = {
  Query: {
    hello: () => { return "world" },
    bookCount: () => { return books.length },
    authorCount: () => authors.length,
    allAuthors: () => authors,
    allBooks: (root, args) => {
      //console.log("args: ", args)
      //console.log("root: ", root)
      //console.log("books: ", books)
      if (args.author === undefined && args.genre === undefined) {
        return books
      } else { //Tää tekee tän nyt tyhmästi, koska sekä auth että genre pitää olla defined parametreissa, muuten palauttaa tyhjää.
        let boo = books.filter(b => (b.author === args.author) && (b.genres.includes(args.genre)))
        console.log("boo: ", boo)
        return boo
      }
    }
  },
  Author: {
    bookCount: (root, args) => {
      let authorsWorkNr = books.filter(b => b.author === root.name).length
      //console.log("authWorkNr: ", authorsWorkNr)
      return authorsWorkNr //Note: do not wrap in { }! Sos happens!
    }
  },
  Mutation: {
    addBook: (root, args) => {
      console.log("args: ", args)
      console.log("root: ", root)
      const newBook = { ...args, id: uuid() }
      books = books.concat(newBook)
      return newBook
    },
    editAuthor: (root, args) => {
      //console.log("args: ", args)
      let editThisPerson = authors.find(a => a.name === args.name)
      //console.log("editThisPerson: ", editThisPerson)
      if (!editThisPerson) {
        return editThisPerson
      } else {
        let updP = { ...editThisPerson, born: args.setBornTo }
        authors = authors.map(a => a.name === editThisPerson.name ? updP : a)
        //console.log("updP:", updP)
        return updP
      }
    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})