import express from 'express';
import * as wishController from '../controllers/wishController.js';
const router = express.Router();

 /**
 * @openapi
 * /wishes.xml:
 *   get:
 *     summary: Returns rss feed
 *     description: Returns an rss feed with anonymous wishes
 *     tags: 
 *          - Wishes
 *     responses:
 *       200:
 *         description: Returns the rss feed in xml format
 */
router.route('/wishes.xml').get(wishController.get);

/**
 * @openapi
 * /wish:
 *   post:
 *     summary: Adds product to feed
 *     description: Sends a post request to add product to wished for products feed
 *     tags: 
 *          - Wishes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "PSVR2"
 *               price:
 *                 type: integer
 *                 default: 4790
 *               product_url:
 *                 type: string
 *                 default: "https://www.coolshop.dk/produkt/playstation-vr2/23DP8S/"
 *               image_url:
 *                 type: string
 *                 default: "https://preview.redd.it/qqlv2zalbro81.jpg?auto=webp&s=ecd9bf574664df4470df2f3bd15503a3c683e229"
 *     responses:
 *       200:
 *         description: Returns a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.route('/wish').post(wishController.add);

// Not really a requirement
//router.route('/wish/:id').delete(wishController.remove);

export { router as WishRouter }