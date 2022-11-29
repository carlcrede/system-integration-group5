import { Box, Button, Center, Flex, Img, Input, InputGroup, InputRightElement, Link, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import { useQuery, gql } from '@apollo/client';
import { SearchIcon, StarIcon } from "@chakra-ui/icons";

const SEARCH_PRODUCTS = gql`
  query GetLocations {
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

function Root() {
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS);

  return (
    <Flex flexDir='column' align={'center'} justifyContent={'center'}>
        <Text fontSize='x-large'>Products</Text>
        <InputGroup size='md'>
          <Input placeholder='Product name' />
          <InputRightElement>
            <Button>
              <SearchIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
        {(loading || !data) && <Spinner />}
        <SimpleGrid columns={3} spacing={8} my="5">
          {data && data.products && data.products.map((item) => (
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
          ))}
        </SimpleGrid>
    </Flex>
  )
}

export default Root;