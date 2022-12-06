import fs from 'fs';
import { feed } from '../util/feed.js'


// get wishes
export function get(req, res) {
    res.statusCode = 200;
    res.type('application/xml').send(feed.xml());
}

// add wish
export function add(req, res) {
    // add to feed
    feed.item({
        title: req.body.name,
        description: "A user wished for " + req.body.name,
        guid: Date.now(),  
        date: Date.now(),
        custom_elements: [
            { 'name': req.body.name },
            { 'price': req.body.price },
            { 'product_url': req.body.product_url },
            { 'image_url': req.body.image_url }
        ]
    });

    // save to xml file
    fs.writeFile('./wishes.xml', feed.xml(), (err) => {
        if (err) {
            console.log(err);
        }
    });

    // return message
    res.statusCode = 200;
    res.json({ message: "Wish added to feed!"});
}

export function remove(req, res) {
    const id = req.params.id;
    let found = false;

    for (let i = 0; i < feed.items.length; i++) {
        if (feed.items[i].guid = id) {
            found = true;
            feed.items.splice(i, 1);

            // save to xml file
            fs.writeFile('./wishes.xml', feed.xml(), (err) => {
                if (err) {
                    console.log(err);
                }
            });

            res.statusCode = 200;
            res.json({ message: "Wish removed from feed!"});
        }
    }

    // return error if not found
    if (!found) {
        res.statusCode = 404;
        res.json({ message: "Wish was not found!"});
    } 
}