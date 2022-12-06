import RSS from 'rss';
import fs from 'fs';
import Parser from 'rss-parser';

// load from xml file
let parser = new Parser({
    customFields: {
        item: ['name', 'price', 'product_url', 'image_url']
    }
});
let xml = fs.readFileSync('./wishes.xml').toString();

let feed = new RSS({
    title: 'Wishes',
    description: 'This is a feed of all the wishes made in the giftshop',
    feed_url: 'http://example.com/rss.xml',     //Url to the rss feed   // TODO input feed url
    site_url: 'http://example.com',             //Url to the site that the feed is for //TODO ask them for their url i guess
    image_url: 'http://example.com/icon.png',   //Optional url string small image for feed readers to use
    docs: "what?", // TODO link to documentation // Optional, url string, Url to documentation on this feed
    webMaster: "The cool group B)",    // who manages feed availability and technical support
    language: 'en',
    ttl: 1, // optional, integer, number of minutes feed can be cached before refreshing from source
    pubDate: Date.now()
});


if (xml) {
    const parsedXml = await parser.parseString(xml);

    parsedXml.items.forEach(item => {
        feed.item({
            title: item.title,
            description: item.content,
            guid: item.guid,
            date: item.pubDate,
            custom_elements: [
                { 'name': item.name },
                { 'price': item.price },
                { 'product_url': item.product_url },
                { 'image_url': item.image_url }
            ]
        });
    });
}

export { feed }