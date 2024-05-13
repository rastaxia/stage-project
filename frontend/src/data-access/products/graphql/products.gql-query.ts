import { gql } from 'apollo-angular';

export const getProductsQuery = gql`
  query Products($pagination: PaginationArg!, $filters: ProductFiltersInput) {
    products(pagination: $pagination, filters: $filters) {
      data {
        id
        attributes {
          ean
          name
          displayName
          mainSupplierKey
          categoryCode
          suppliers {
            sellingPrice
            key
          }
          properties {
            key
            value
          }
          category {
            code
            name
          }
          tags {
            tag
          }
          images {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductQuery = gql`
  query Product($id: ID!) {
    product(id: $id) {
      data {
        id
        attributes {
          ean
          name
          displayName
          mainSupplierKey
          categoryCode
          suppliers {
            sellingPrice
            key
          }
          properties {
            key
            value
          }
          category {
            code
            name
          }
          tags {
            tag
          }
          images {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
