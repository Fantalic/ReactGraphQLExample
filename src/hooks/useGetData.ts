import { ApolloClient, InMemoryCache, gql, useLazyQuery } from "@apollo/client";

import { useMemo } from "react";

// initialize a GraphQL client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
});

// write a GraphQL query that asks for names and codes for all countries
const LIST_PEOPLE = gql`
  {
    allPeople {
      edges {
        node {
          __typename
          id
          name
          birthYear
          eyeColor
          hairColor
          homeworld {
            id
            name
          }
          filmConnection {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

const useGetData = () => {
  const [load, { loading, data }] = useLazyQuery(LIST_PEOPLE, { client });
  const result = useMemo(() => ({ data, load }), [data, load]);
  return result;
};

export default useGetData;
