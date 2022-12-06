import {
    Flex,
    TabList,
    Tabs,
    Tab,
    Text,
    TabPanels,
    TabPanel,
    Stack,
    HStack,
    VStack,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from "@chakra-ui/react"
import { Link } from "react-router-dom";
import LoginPage from "../routes/LoginPage";

function NavBar() {
    return (
        <div>
            <Tabs variant='soft-rounded'>
                <TabList>
                    <Tab>
                        <Link to="/">Home</Link>
                    </Tab>
                    <Tab>
                        <Link to="/">Login</Link>
                    </Tab>
                    <Tab>
                        <Link to="/">SignUp</Link>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Flex align={'center'} justifyContent={'center'}>
                            <Text>Wishlist Home</Text>
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <LoginPage />
                    </TabPanel>
                    <TabPanel>
                        <Flex align={'center'} justifyContent={'center'}>
                            <Text>Sign Up</Text>
                        </Flex>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div >
    )
}

export default NavBar;