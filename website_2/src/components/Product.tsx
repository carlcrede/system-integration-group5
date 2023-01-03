import { StarIcon } from "@chakra-ui/icons";
import { Box, Collapse, Divider, Img, Link, Text } from "@chakra-ui/react";
import React, { FunctionComponent, useState } from "react";
import { Product as ProductType } from "../gql/graphql";

interface ProductProps {
    item: ProductType
}
 
const Product: FunctionComponent<ProductProps> = ({ item }) => {
    const [open, setOpen] = useState(false)

    return ( 
        <Box p='2' border='1px' borderColor='gray.200' borderRadius="md" bgColor={"#DAEFFA"}>
            <Text mr='auto'>{item.main_category} {">"} {item.sub_category}</Text>
            <Box onClick={() => setOpen(true)}>
            <Img my="5" />
            <Link href={item.link || ''}><b>{item.product_name}</b></Link>
            <Text>{item.product_sub_title}</Text>
            <Collapse in={open} animateOpacity>
                <Divider />
                <Text textAlign='center' mt="2">Product description</Text>
                <Text textAlign='center'>{item.product_description}</Text>
            </Collapse>
            <Divider mt="5" mb="2" />
            <Box display='flex' justifyContent='space-between'>
                <Text>Rating: {item.overall_rating} <StarIcon /></Text>
                <Text>{item.price}</Text>
            </Box>
            </Box>
        </Box>
    );
}
 
export default Product;