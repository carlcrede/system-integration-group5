import { Box, Image, BoxProps } from "@chakra-ui/react";
const logo_url = 'https://d1gkd65id2ekzc.cloudfront.net/test.jpg';

const Logo = (boxProps: BoxProps) => {
  return (
    <Box {...boxProps}>
        <Image maxH="50px" borderRadius='md' src={logo_url} alt="logo" />
    </Box>
  )
}

export default Logo;