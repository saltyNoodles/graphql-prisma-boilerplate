import { gql } from 'apollo-boost';

export const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      user {
        email
        name
        id
      }
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

export const login = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

export const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;
