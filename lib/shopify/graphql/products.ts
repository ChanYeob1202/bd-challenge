// This query fetches products directly (not from a collection)
// Use this if the store doesn't have collections set up

export const getAllProducts = `#graphql
  query getAllProducts($first: Int = 20) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;
