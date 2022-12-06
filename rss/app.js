import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import RSS from 'rss';
import fs from 'fs';
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());

// load from xml file?
// create feed from xml file?


let feed = new RSS({
    title: 'Wishes',
    description: 'This is a feed of all the wishes',
    feed_url: 'http://example.com/rss.xml',     //Url to the rss feed   // TODO input feed url
    site_url: 'http://example.com',             //Url to the site that the feed is for //TODO ask them for their url i guess
    image_url: 'http://example.com/icon.png',   //Optional url string small image for feed readers to use
    docs: "what?", // TODO link to documentation // Optional, url string, Url to documentation on this feed
    webMaster: "The cool group",    // who manages feed availability and technical support
    language: 'en',
    ttl: 1, // optional, integer, number of minutes feed can be cached before refreshing from source
            // TODO too low? 
    pubDate: Date.now()
});

// get feed
app.get('/wishes.xml', (req, res) => {
    res.statusCode = 200;
    res.set('Content-Type', 'text/xml');
    res.json({ feed: feed.xml() });
});

// add to feed
app.post('/wish', (req, res) => {
    // TODO insert wish to feed
    feed.item({
        title: req.body.name,
        description: 
            "A user wished for " + req.body.name + ". " + req.body.price + ",-" +
            req.body.image_url,  // TODO
        guid: Date.now(),   // we'll just use ms from epoch time as id
        date: Date.now().toLocaleString(),
        link: req.body.product_url 
    });

    // save to xml file?
    // TODO

    // return message
    res.statusCode = 200;
    res.json({ message: "Wish added to feed!"});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});