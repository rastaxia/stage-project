import { gql } from 'apollo-angular';

export const getMeQuery = gql`
  query {
    me {
      id
      email
      username
    }
  }
`;
