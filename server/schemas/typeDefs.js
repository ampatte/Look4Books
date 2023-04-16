const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    
    addUser(username: String!, email: String!, password: String!): Auth

    saveBook(author:[], description: String!, title: String!, bookId: ID!, link: params): User

    removeBook(bookId: ID!): User   
}

type User {
    id: ID
    username: String
    email: String
    bookCount: String!
    savedBooks: [Book]
}

type Book {
    id: ID
    authors: [String!]
    description: String!
    title: String!
    image
    link
}

type Auth{
    token ID
    user: User
}
`;

mosule.exports = typeDefs;