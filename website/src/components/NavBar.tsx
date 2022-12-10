import {
    TabList,
    Tabs,
    Tab,
    Box,
    Divider,
    Text
} from "@chakra-ui/react"
import React, { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";

type Props = {
    selectedIndex: 0 | 1 | 2 | 3 | 4
}

const NavBar: FunctionComponent<Props> = ({selectedIndex}) => {
    const {getUserToken, logout} = useAuth()
    const navigate = useNavigate()
    const onLogout = () => {
        navigate('/login')
        logout()
    }
    return (
        <Box mb="4">
            <Tabs 
                my="2" 
                variant='soft-rounded' 
                index={selectedIndex}>
                <TabList justifyContent='center' alignItems='center' ml='-125'>
                    <Text>(Logo)</Text>
                    <Logo mx="3" />    
                    {getUserToken() ? (
                        <>
                        <Tab>
                            <Link to="/">Home</Link>
                        </Tab>                        
                        <Tab>
                            <Link to="/send-invites">Send Invites</Link>
                        </Tab>                        
                        <Tab onClick={onLogout}>
                            Log out
                        </Tab>
                        </>
                    ): (
                        <>
                    <Tab>
                        <Link to="/login">Login</Link>
                    </Tab>
                    <Tab>
                        <Link to="/sign-up">Sign Up</Link>
                    </Tab>
                        </>
                    )}
                </TabList>
            </Tabs>
            <Divider />
        </Box>
    )
}

export default NavBar;