const graphql = require('graphql');
const _ = require('lodash');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema ,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

// dummy data
const books = [ 
  {name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1'},
  {name: 'The final Empire', genre: 'Fantasy', id: '2', authorId: '2'},
  {name: 'The long earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
  {name: 'The hero of ages', genre: 'Fantasy', id: '4', authorId: '2'},
  {name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3'},
  {name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3'}
];

const authors = [
  {name: 'Patrick Rothfuss', age: 44, id: '1'},
  {name: 'Brandon Sanderson', age: 42, id: '2'},
  {name: 'Trrey Patrchett', age: 66, id: '3'}
];

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log('[author:resolve] parent.id:', parent.id);
        console.log('[author:resolve] books:', _.filter(books, {authorId: parent.id}));
        return _.filter(books, {authorId: parent.id});
      }
    }
  })
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: { 
      type: AuthorType,
      resolve(parent, args) {
        console.log('[book:resolve] parent:', parent);
        return _.find(authors, { id: parent.authorId});
      }
    }
  })
})

/**
 * @returns return book type indexing by id
 */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
        console.log("[qury:book] type of id: " + typeof(args.id), 'value of:', args.id);
        // code to get data from database
        return _.find(books, { id: args.id })
      }
    },
    author: {
      type: AuthorType,
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
        console.log("[query:author] type of id: " + typeof(args.id), 'value of:', args.id);
        // code to get data from database
        return _.find(authors, { id: args.id })
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return books;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        return authors;
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})