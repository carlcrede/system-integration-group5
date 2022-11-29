import { Box, Button, Center, Flex, Img, Input, InputGroup, InputRightElement, Link, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import { useQuery, gql } from '@apollo/client';
import { SearchIcon, StarIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

const LIST_PRODUCTS = gql`
  query GetProducts {
      products(pageNumber: 1) {
        id,
        product_name,
        product_sub_title,
        product_description,
        price,
        main_category,
        sub_category
        link,
        overall_rating
    }
  }
`;

const SEARCH_PRODUCTS = gql`
  query SearchProducts($name: String!) {
    searchProduct(name: $name) {
        id,
        product_name,
        product_sub_title,
        product_description,
        price,
        main_category,
        sub_category
        link,
        overall_rating
    }
  }
`;

function Root() {
  const [productNameInput, setProductNameInput] = useState('')
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS, {
    variables: { name: productNameInput }
  });

  const item = data?.searchProduct 
  return (
    <Flex flexDir='column' align={'center'} justifyContent={'center'}>
        <Text fontSize='x-large'>Products</Text>
        <InputGroup size='md'>
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
        <SimpleGrid columns={3} spacing={8} my="5">
          {/* {data && data.products && data.products.map((item) => ( */}
          {item && (
            <Box key={item.id} p='2' border='1px' borderColor='gray.200' borderRadius="md">
              <Text mr='auto'>{item.main_category} {">"} {item.sub_category}</Text>
              <Img my="5" />
              <Link href={item.link}><b>{item.product_name}</b></Link>
              <Text>{item.product_sub_title}</Text>
              <Box display='flex' justifyContent='space-between' mt="5">
                <Text>Rating: {item.overall_rating} <StarIcon /></Text>
                <Text>{item.price}</Text>
              </Box>
            </Box>
            )}
          {/* ))} */}
        </SimpleGrid>
    </Flex>
  )
}

export default Root;