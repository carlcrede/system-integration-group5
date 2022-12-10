# How to authenticate

Users can sign up, log in and log out using email and password.

The authentication is served by a REST API.
See the Swagger documentation at https://si-authentication.azurewebsites.net/docs/

# Signing up
The user will use the following endpoint for signing up:
- https://si-authentication.azurewebsites.net/signup

The user information will be send in json with the following properties:
```json
{
  "email": "email@email.com",
  "password": "123",
  "name": "Steve Jobs",
  "picturePath": "string"
}
```
The user information will be saved in a database and the password will be salted and hashed to ensure security in case of a leak.

# Logging in
The user will use the following endpoint for logging in:
- https://si-authentication.azurewebsites.net/login

The credentials will be send in json in the following format:
```json
{
  "email": "mail@mail.com",
  "name": "John Doe"
}
```
If the credentials are correct, the user information will be returned along with a jwt token. If the credentials were incorrect the request will return an error message.

## JWT
We use Passportjs to manage the authentication. Passport verifies the login information and if correct we will return a jwt token to the user. This token will then be send on subsequent requests after that to access protected routes. Since the token is stored at the client, it also means that the system becomes more scaleable since we can just set up more servers and the servers will then verify the incoming tokens, based on the secret that is shared among them. An alternative would be sessions, which would require that the information would be stored on the server side, but this means that the application is more difficult to scale as you need a form of master server that knows which systems contains the information for which session. With jwt all servers know the secret and will then be able to decrypt the tokens no matter where they come from.

### Protected routes
If we can't authenticate the user, an error message indicating that the user will need to log in will be returned and the user will be unable to proceed until they do so. This is only the case for protected routes. If you visit the swagger documentation you will see that the protected routes are indicated by a lock. You cannot access these endpoints without logging in and establishing logging in and setting the bearer token.

# Accepting invitations
We have provided an endpoint for accepting an invitation:
- https://si-authentication.azurewebsites.net/wishlists/{id}/invites/{token}

The server will verify if the invitation actually exists, if it has expired, if the person accepting it is the one who was invited, or if it is already been accepted once. If the user is able to accept the invitation then the wishlist will be returned.

# Logging out
To log out the user can simply delete their token.
