import { Box, Image, BoxProps, ImageProps } from "@chakra-ui/react";
const logo_url = 'https://d1gkd65id2ekzc.cloudfront.net/test.jpg';

interface LogoProps {
  boxProps?: BoxProps;
  imageProps?: ImageProps;
  img_url?: string;
}

const Logo = ({ boxProps, imageProps, img_url }: LogoProps) => {
  return (
    <Box mx="3" {...boxProps}>
        <Image maxH="50px" borderRadius='md' {...imageProps} src={img_url || logo_url} alt="logo" />
    </Box>
  )
}

export default Logo;