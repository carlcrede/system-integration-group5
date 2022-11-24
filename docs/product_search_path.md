# How to query the products.db file

You'll be querying the GraphQL server that lives in the cloud as an Azure app service. you may experience a slower start on the first try. The url with the correct - and only - endpoint is 
```
https://si-products-graphql3.azurewebsites.net/graphql
```
Here, you will find both the Subscription object as well as the queries documented so that you can play with those and utilize them as you wish.
For the Subscription object, see in the playground how the Subscription is done and do subscribe to get the information every time the database file is updated.

The Redis server bonus path was not implemented so we cannot provide that one for you, unfortunately.
