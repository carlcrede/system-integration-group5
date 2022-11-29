# How to manage wishlists and invites

An authenticated user can create a wishlist. They can also invite people to this wishlist.
Users that receive the invite link can use it to accept the invite. The invites expire after 2 days.

The wishlists and invites are served by a REST API.
See the Swagger documentation at https://si-authentication.azurewebsites.net/docs/

# How to listen to status of friends in a wishlist

The users that have joined a wishlist (the creator and whoever accepted an invite for it) can see each others statuses.
- Users are shown as `Not Registered` while they have an invite pending for the wishlist.
- Users are shown as `Offline` while they have accepted an invite for the wishlist, but are not currently looking at it.
- Users are shown as `Online` while they have accepted an invite for the wishlist and are currently looking at it.

Websockets are used to expose the status of the users. Specifically the [socket.io](https://socket.io/) implementation. [Rooms](https://socket.io/docs/v4/rooms/) are used to manage the status of users in a wishlist.

Socket.io server: https://si-authentication.azurewebsites.net

## To join a wishlist room   
|eventName|data|
|------------|---|
|`joinroom`|`roomId`: String, must be equal to the wishlist's `_id`|

## To get the list of online users in the wishlist room
|eventName|data|
|------------|---|
|`online`|JSON👇|

```json
[
    {
        "email": "john@email.com",
        "name": "John Brown"
    }
]
```

## To get the list of offline users in the wishlist room
|eventName|data|
|------------|---|
|`offline`|JSON👇|
```json
[
    {
        "email": "john@email.com",
        "name": "John Brown"
    }
]
```

## To get the list of not registered users in the wishlist room
|eventName|data|
|------------|---|
|`notRegistered`|JSON👇|
```json
[
    {
        "email": "john@email.com",
        "name": "Unknown" // Will always be this value
    }
]
```

## Logged in user's name
|eventName|data|
|------------|---|
|`name`|`name`: String|

## Logged in user's email
|eventName|data|
|------------|---|
|`email`|`email`: String|