import { gql } from "@apollo/client"


export const LOGIN_USER =gql`
mutation loginUser(email: String!, password: String!) {
    loginUser(email: $email, password: $password) {
        token
        user{
            _id
            username
        }

    }
}
`;

export const ADD_USER =gql`
mutation addUser(username: String!, email: String!, password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user{
            _id
            username
        }

    }
}
`;

export const SAVE_BOOK = gql`
mutation saveBook(bookID:ID!, author: String!, description: String!, title: String!, bookId: ID!, image: String, link: String!){
    saveBook(bookID: $bookID, author: $author, description: $description, title: $title, image: $image, link: $link) {
        _id
        author
        description
        image
        link
    }
}
`;

export const REMOVE_BOOK = gql`
mutation saveBook(bookID:ID!){
    saveBook(bookID: $bookID) {
        _id
    }
}
`;




