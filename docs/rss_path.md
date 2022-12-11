# RSS feed

You can retrieve the rss feed and add wishes to it.

The feed is served by a REST API.
See the Swagger documentation at https://si-rss-feed.azurewebsites.net/docs

# Retrieving the feed
To retrieve the feed you will send a GET request to the following endpoint:
- https://si-rss-feed.azurewebsites.net/wishes.xml

This will return the feed in xml format.

## Parsing the feed
Any standard rss parser should be able to parse the feed, but note that we have the following custom fields in our feed:
- 'name'
- 'price'
- 'product_url'
- 'image_url'

When you parse the feed you can then use this data to fit your needs.

# Adding to the feed
To add to the feed, you will be sending a POST request to the following url:
- https://si-rss-feed.azurewebsites.net/wish

The wish will be send in json in the following format:
```json
{
  "name": "laptop",
  "price": 7000,
  "product_url": "string",
  "image_url": "string"
}
```
Since the intent is just an anonymous feed of user wishes, we only send product info and not user info.

## Feed limitations
Since the intent is an anonymous feed that is updated, we have chosen to limit the feed to 50 items. This was done for multiple reasons. The intent is a list that is shown on the frontpage, or on other pages, of products recently wished for, so having a list of 1000s of items seems redundant. Since the feed is also stored as xml, it seems redundant to send 1000s of items on every request when we only want recent wished for items to show. It only seemed logical to limit the feed size since a feed that is ever growing, without any real reason, would just slow down the server. The feed will then be faster to send to users since it's size is relatively fixed.