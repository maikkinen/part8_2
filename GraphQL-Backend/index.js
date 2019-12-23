const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./src/models/Author')
const Book = require('./src/models/Book')
const uuid = require('uuid/v1')

mongoose.set('useFindAndModify', false)

const MONGODB_URI = 'mongodb+srv://Sintti-Clusteroid:4HisGlory@closterud-bchpd.mongodb.net/library?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


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
    bookCount: () => Person.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async (root, args) => { 
      const a = await Author.find({})
      console.log('a is: ', a)
      return a
    },
    allBooks: async (root, args) => { 
      let books = await Book.find({})
      console.log("books: ", books)
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
      return authorsWorkNr
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log("args: ", args)
      console.log("root: ", root)
      const newBook = new Book({ ...args })

      try {
        await newBook.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return newBook
    },
    editAuthor: async (root, args) => {
      //console.log("args: ", args)
      let editThisPerson = await Author.find(a => a.name === args.name)
      //console.log("editThisPerson: ", editThisPerson)

      try {
        await Author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return editThisPerson
      /*
      if (!editThisPerson) {
        return editThisPerson
      } else {
        let updP = { ...editThisPerson, born: args.setBornTo }
        authors = authors.map(a => a.name === editThisPerson.name ? updP : a)
        //console.log("updP:", updP)
        return updP
      }
      */
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