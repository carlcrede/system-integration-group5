import { Flex, Input, InputGroup, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import { useQuery, gql } from '@apollo/client';
import { useState } from "react";
import Product from "../components/Product";
import { Product as ProductType } from "../gql/graphql";
import PageTemplate from "../containers/PageTemplate";

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

function HomePage() {
  const [productNameInput, setProductNameInput] = useState('')
  const { loading, error, data } = useQuery(SearchProductDocument, { variables: { name: productNameInput } })

  return (
    <PageTemplate selectedIndex={0}>
    <Flex flexDir='column' align={'center'} justifyContent={'center'}>
        <Text fontSize='x-large'>Products</Text>
        <InputGroup size='md' my="5" px="5">
          <Input
            value={productNameInput}
            onChange={(event) => setProductNameInput(event.target.value)}
            placeholder='Product name' />
        </InputGroup>
        {loading && <Spinner />}
        {error && <Text>{error.message}</Text>}
        <SimpleGrid columns={{sm: 2, md: 3}} spacing={8} m="5">
          {data && data.searchProduct && data.searchProduct.map((item: ProductType) => (
            <Product key={item.id}  item={item} />
          ))}
        </SimpleGrid>
    </Flex>
    </PageTemplate>
  )
}

export default HomePage;