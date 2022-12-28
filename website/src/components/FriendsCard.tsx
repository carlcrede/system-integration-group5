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
        // _id: string;
        // firstName: string;
        // lastName: string;
        email: string;
        name: string;
    }

    const { getUserToken } = useAuth()
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [offlineFriends, setOfflineFriends] = useState([]);
    const [unregisteredFriends, setUnregisteredFriends] = useState([]);

    useEffect(
        () => {
            const socket = io("https://si-authentication.azurewebsites.net", {
                query: {
                    token: getUserToken()
                },
                transports: ['websocket', 'polling']
            });

            
            joinRoom()

            function joinRoom() {
                const roomNumber = "637e849b6cbce308c1108662";
                // console.log(roomNumber);
                socket.emit("joinroom", roomNumber);
              }

              socket.on('room', (data) => {
                console.log(data + " joined the room");
              });

            socket.on("online", (data) => {
                setOnlineFriends(data);
                console.log("Online: " + data);
            });

            socket.on("offline", (data) => {
                setOfflineFriends(data);
                console.log("Offline: " + data);
            });

            socket.on("notRegistered", (data) => {
                setUnregisteredFriends(data);
                console.log("Not registered: " + data);
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
                                Online &bull; ({onlineFriends.length ? onlineFriends.length : 0})
                            </Heading>
                            <UnorderedList>
                                {onlineFriends.map((friend: Friend) => (
                                    <ListItem key={friend.email}>{friend.name}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'red'}>
                                Offline &bull; ({offlineFriends.length ? offlineFriends.length : 0})
                            </Heading>
                            <UnorderedList>
                                {offlineFriends.map((friend: Friend) => (
                                    <ListItem key={friend.email}>{friend.name}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'gray'}>
                                Not registered &bull; ({unregisteredFriends.length ? unregisteredFriends.length : 0})
                            </Heading>
                            <UnorderedList>
                                {unregisteredFriends.map((friend: Friend) => (
                                    <ListItem key={friend.email}>{friend.email ? friend.email : "[No email found?!]"}</ListItem>
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