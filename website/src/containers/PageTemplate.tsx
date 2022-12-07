import { Box } from "@chakra-ui/react";
import React, { FunctionComponent, ReactElement } from "react";
import NavBar from "../components/NavBar";

interface PageTemplateProps {
    children: ReactElement,
    selectedIndex: 0 | 1 | 2 | 3 | 4
}
 
const PageTemplate: FunctionComponent<PageTemplateProps> = ({children, selectedIndex}) => {
    return ( 
        <Box flexDir='column' justifyContent={'center'}>
            <NavBar selectedIndex={selectedIndex} />
            {children}
        </Box>
    );
}
 
export default PageTemplate;