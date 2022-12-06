import {
    TabList,
    Tabs,
    Tab,
    Box,
    Divider,
} from "@chakra-ui/react"
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

type Props = {
    selectedIndex: 0 | 1 | 2
}

const NavBar: FunctionComponent<Props> = ({selectedIndex}) => {
    return (
        <Box mb="4">
            <Tabs 
                my="2" 
                variant='soft-rounded' 
                index={selectedIndex}>
                <TabList justifyContent='center'>
                    <Tab>
                        <Link to="/">Home</Link>
                    </Tab>
                    <Tab>
                        <Link to="/login">Login</Link>
                    </Tab>
                    <Tab>
                        <Link to="/sign-up">SignUp</Link>
                    </Tab>
                </TabList>
            </Tabs>
            <Divider />
        </Box>
    )
}

export default NavBar;