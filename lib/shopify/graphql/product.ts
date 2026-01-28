// This query fetches detailed information about a single product
// Used when someone clicks "Quick View" to show all the details in the modal

export const getProductByHandle = `#graphql
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;
