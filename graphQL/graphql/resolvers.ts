import { db } from "./db";
import { PubSub } from "graphql-subscriptions";

export const pubsub: PubSub = new PubSub();

const resolvers = {
    Subscription: {
        newDatabase: {
            subscribe: (_, __) => pubsub.asyncIterator("NEW_DB")
        }
    },
    Query: {
        product: (_, args) => db.prepare(
            `SELECT * FROM products WHERE products.id = ?`
        ).get(args.id),

        products: (_, __) => {
            return db.prepare(
                `SELECT * FROM products`
            ).all()
        },

        categories: (_,) => db.prepare(
            `SELECT DISTINCT main_category FROM products`
        ).all(),

        subcategories: (_,) => db.prepare(
            `SELECT DISTINCT sub_category FROM products`
        ).all(),

        productImage: (_, args) => db.prepare(
            `SELECT * FROM product_images WHERE product_id = ?`
        ).get(args.id),

        productAdditionalInfo: (_, args) => db.prepare(
            `SELECT * FROM products_additional_info WHERE product_id = ?`
        ).get(args.id),

        getProductsBySearchTerm: (_, args) => db.prepare(
            `SELECT * FROM products
            WHERE product_name LIKE '%${args.term}%' OR product_sub_title LIKE '%${args.term}%' OR product_description LIKE '%${args.term}%'`
        ).all(),

        getProductsByCategory: (_, args) => db.prepare(
            `SELECT * FROM products
            WHERE main_category LIKE '%${args.category}%'`).all(),

        getProductsBySubcategory: (_, args) => db.prepare(
            `SELECT * FROM products
            WHERE sub_category LIKE '%${args.subcategory}%'`).all(),

        getProductsByPrice: (_, args) => {
            const orderedby: String = args.ascending ? 'ASC' : 'DESC';
            const minPriceQuery: String = (!args.maxPrice && args.minPrice) ? `WHERE pricee >= ${args.minPrice}` : ""
            const maxPriceQuery: String = (args.maxPrice && !args.minPrice) ? `WHERE pricee <= ${args.maxPrice}` : ""
            const bothPriceQuery: String = (args.maxPrice && args.minPrice) ? `WHERE pricee <= ${args.maxPrice} AND pricee >= ${args.minPrice}` : ""
            return db.prepare(
                `SELECT p.*,
                CAST(REPLACE(REPLACE(p.price,'£',''), ',', '') as decimal) as pricee
                FROM products p
                ${minPriceQuery}
                ${bothPriceQuery}
                ${maxPriceQuery}
                ORDER BY pricee ${orderedby}`
            ).all()
        },

        getProductsByRating: (_, args) => {
            const orderedby: String = args.ascending ? 'ASC' : 'DESC';
            const minRatingQuery: String = (!args.maxRating && args.minRating) ? `WHERE overall_rating >= ${args.minRating}` : ""
            const maxRatingQuery: String = (args.maxRating && !args.minRating) ? `WHERE overall_rating <= ${args.maxRating}` : ""
            const bothRatingQuery: String = (args.maxRating && args.minRating) ? `WHERE overall_rating <= ${args.maxRating} AND overall_rating >= ${args.minRating}` : ""
            return db.prepare(
                `SELECT * FROM products 
                ${minRatingQuery}
                ${bothRatingQuery}
                ${maxRatingQuery}
                ORDER BY overall_rating ${orderedby}`
            ).all()
        },
    },

    Product: {
        product_image: (product) => {
            return db.prepare(
                `SELECT * FROM product_images WHERE product_id = ?`
            ).get(product.id);
        },
        product_info: (product) => {
            return db.prepare(
                `SELECT * FROM products_additional_info WHERE product_id = ?`
            ).get(product.id);
        }
    }
}

export default resolvers;