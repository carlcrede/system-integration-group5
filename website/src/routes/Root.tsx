import { Button, Flex, Input, InputGroup, InputRightElement, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import Product from "../components/Product";
import { Product as ProductType } from "../gql/graphql";

const SearchProductDocument = gql(/* GraphQL */ 
`query SearchProduct($name: String!) {
  searchProduct(name: $name) {
      id
      product_name
      product_sub_title
      product_description
      price
      main_category
      sub_category
      link
      overall_rating
  }
}`
)

function Root() {
  const [productNameInput, setProductNameInput] = useState('')
  const { loading, error, data } = useQuery(SearchProductDocument, { variables: { name: productNameInput } })

  const item = data?.searchProduct as ProductType
  return (
    <Flex flexDir='column' align={'center'} justifyContent={'center'}>
        <Text fontSize='x-large'>Products</Text>
        <InputGroup size='md' my="5">
          <Input
            value={productNameInput}
            onChange={(event) => setProductNameInput(event.target.value)}
            placeholder='Product name' />
          <InputRightElement>
            <Button>
              <SearchIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
        {loading && <Spinner />}
        {error && <Text>{error.message}</Text>}
        <SimpleGrid minChildWidth='140px'spacing={8} mx="5">
          {/* {data && data.products && data.products.map((item) => ( */}
          {item && (
            <Product key={item.id}  item={item} />
            )}
          {/* ))} */}
        </SimpleGrid>
    </Flex>
  )
}

export default Root;