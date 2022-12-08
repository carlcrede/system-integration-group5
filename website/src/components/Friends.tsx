import io from 'socket.io-client';
import {
    VStack,
    Box,
    Text,
    Heading,
    UnorderedList,
    ListItem,
    Stack,
    CardHeader,
    CardBody,
    Card,
    StackDivider,
} from "@chakra-ui/react"


function Friends() {
    const userToken = () => {
        return localStorage.getItem('user');
    }
    const socket = io("https://lionfish-app-hsj4b.ondigitalocean.app/", {
        withCredentials: false,
        transports: ['polling', 'websocket'],
        transportOptions: {
            polling: {  // TODO: use userToken() instead of hardcoding the token
                extraHeaders: { "authorizationToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2Njk3Mjc5NjcsImV4cCI6MTcwMTI2Mzk2NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoiNjM3MTQyZTI3ODczOTU2NmQ4OWU5NDQ3In0.sNgdhxdtkk1oVGHETggAkRPF-4boU5gZLPeWltk3aSY" }
            },
        },
    });

    var onlineFriends: string[] = [];
    var offlineFriends: string[] = [];
    var unregisteredFriends: string[] = [];

    socket.on("onlineFriends", (data) => {
        data.forEach((friend: any) => {
            onlineFriends.push(friend.firstName);
        });
        console.log("Online: " + onlineFriends);
    });

    socket.on("offlineFriends", (data) => {
        data.forEach((friend: any) => {
            offlineFriends.push(friend.firstName);
        });
        console.log("Offline: " + offlineFriends);
    });

    socket.on("invitedFriends", (data) => {
        data.forEach((friend: any) => {
            unregisteredFriends.push(friend.email);
        }); 
        console.log("Not registered: " + unregisteredFriends);
    });

    return (
        <VStack w={400} position="static">
            <Card>
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
                                {onlineFriends.map((friend) => (
                                    <ListItem key={friend}>{friend}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'red'}>
                                Offline &bull; ({offlineFriends.length})
                            </Heading>
                            <UnorderedList>
                                {offlineFriends.map((friend) => (
                                    <ListItem key={friend}>{friend}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase' color={'gray'}>
                                Not registered &bull; ({unregisteredFriends.length})
                            </Heading>
                            <UnorderedList>
                                {unregisteredFriends.map((friend) => (
                                    <ListItem key={friend}>{friend}</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </VStack>

    );
}


export default Friends;