import { Box } from "@chakra-ui/react";
import React, { FunctionComponent, ReactElement } from "react";
import NavBar from "../components/NavBar";
import Friends from "../components/Friends";

interface PageTemplateProps {
    children: ReactElement,
    selectedIndex: 0 | 1 | 2 | 3 | 4
}

const PageTemplate: FunctionComponent<PageTemplateProps> = ({ children, selectedIndex }) => {
    return (
        <Box w="100%">
            <NavBar selectedIndex={selectedIndex} />
            {children}
            <Friends />
        </Box>
    );
}

export default PageTemplate;