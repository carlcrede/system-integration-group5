import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Heading,
    UnorderedList,
    ListItem,
    Stack,
    CardHeader,
    CardBody,
    Card,
    StackDivider,
} from "@chakra-ui/react"
import { useAuth } from "../hooks/useAuth";
import friendStyle from "../components/friends.module.css";

function FriendsCard() {

    interface Friend {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    }

    const { getUserToken } = useAuth()
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [offlineFriends, setOfflineFriends] = useState([]);
    const [unregisteredFriends, setUnregisteredFriends] = useState([]);

    useEffect(
        () => {
            const socket = io("https://lionfish-app-hsj4b.ondigitalocean.app/", {
                withCredentials: false,
                transports: ['polling', 'websocket'],
                transportOptions: {
                    polling: {  
                        extraHeaders: { "authorizationToken": getUserToken() }
                        // we used this hardcoded token to test the websocket connection, since we don't have the invites endpoint yet
                        // extraHeaders: { "authorizationToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2Njk3Mjc5NjcsImV4cCI6MTcwMTI2Mzk2NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoiNjM3MTQyZTI3ODczOTU2NmQ4OWU5NDQ3In0.sNgdhxdtkk1oVGHETggAkRPF-4boU5gZLPeWltk3aSY" }
                    },
                },
            });



            socket.on("onlineFriends", (data) => {
                setOnlineFriends(data);
                console.log("Online: " + data);
                console.log("Online event");
            });

            socket.on("offlineFriends", (data) => {
                setOfflineFriends(data);
                console.log("Offline: " + data);
                console.log("Offline event");
            });

            socket.on("invitedFriends", (data) => {
                setUnregisteredFriends(data);
                console.log("Not registered: " + data);
                console.log("Not registered event");
            });
        }, []
    )

    return (
        <Container className={friendStyle.sticky}width={300}>
            <Card bg="#c3d6e0" border="1px" borderColor="gray.200" borderRadius="lg" boxShadow="lg" p="2">
                <CardHeader>
                    <Heading size='md'>Friends</Heading>
                </CardHeader>

                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'green'}>
                                Online &bull; ({onlineFriends.length})
                            </Heading>
                            <UnorderedList>
                                {onlineFriends.map((friend: Friend) => (
                                    <ListItem key={friend._id}>{friend.firstName}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'red'}>
                                Offline &bull; ({offlineFriends.length})
                            </Heading>
                            <UnorderedList>
                                {offlineFriends.map((friend: Friend) => (
                                    <ListItem key={friend._id}>{friend.firstName}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'gray'}>
                                Not registered &bull; ({unregisteredFriends.length})
                            </Heading>
                            <UnorderedList>
                                {unregisteredFriends.map((friend: Friend) => (
                                    <ListItem key={friend._id}>{friend.email ? friend.email : "[No email found?!]"}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </Container>

    );
}


export default FriendsCard;