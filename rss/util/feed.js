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
    feed_url: 'https://si-rss-feed.azurewebsites.net/wishes.xml',   //Url to the rss feed
    site_url: 'http://theothergroupssite.com',                      //Url to the site that the feed is for
    docs: 'https://si-rss-feed.azurewebsites.net/docs/',            // Optional, url to documentation on this feed
    webMaster: "The cool group B)",                                 // who manages feed availability and technical support
    language: 'en',
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