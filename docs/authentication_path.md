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
If the credentials are correct, the user information will be returned along with a success message. If the credentials were incorrect the request will return an error message. If all things worked a session will be established between the server and the user.

## Sessions
We use Passportjs to manage the authentication. Passport initializes a session with the user when the user logs in. The session token is stored in a cookie in the browser. This means that every subsequent request will automatically include the session token, which passport will use to authenticate the user. This should make it easier to integrate with as it should happen automatically. If this is not the case, make sure you have cookies enabled in your browser. With a session you will be able to access protected routes.

### Protected routes
If we can't authenticate the user, an error message indicating that the user will need to log in will be returned and the user will be unable to proceed until they do so. This is only the case for protected routes. If you visit the swagger documentation you will see that the protected routes are indicated by a lock. You cannot access these endpoints without logging in and establishing a session.

# Accepting invitations
We have provided an endpoint for accepting an invitation:
- https://si-authentication.azurewebsites.net/wishlists/{id}/invites/{token}

The server will verify if the invitation actually exists, if it has expired, if the person accepting it is the one who was invited, or if it is already been accepted once. If the user is able to accept the invitation then the wishlist will be returned.

# Logging out
We have provided an endpoint to forcefully end a session:
- https://si-authentication.azurewebsites.net/logout

This will tell the server that a session is no longer valid. This might be valid since hackers could potentially hijack a session, so forcefully ending a session would force them out as their subsequent requests would be denied. Using the login endpoint would then establish a new session. You will not need to send anything in the body of the request, as the cookie will automatically be send to the server, so it knows which session to end.
