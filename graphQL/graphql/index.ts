import { ApolloServer, gql } from 'apollo-server-azure-functions';
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import Database, { Database as DB} from "better-sqlite3";
import fetch from 'cross-fetch';

let db: DB;
let modified: number | undefined;

const db_connect = async () => {
    const response = await fetch('https://keablob.blob.core.windows.net/products/products_final.db');
    const last_modified = new Date(response.headers.get('last-modified')).getTime();
    
    if (modified && modified >= last_modified) {
        return;
    }
    
    modified = last_modified;

    const db_db = await response.arrayBuffer();
    const db_buff = Buffer.from(db_db);
    db = new Database(db_buff, { verbose: console.log });
}

setInterval(async () => {
    await db_connect();
}, 10000);

const typeDefs = gql`
    type Product {
        id: ID!
        product_name: String!
        product_sub_title: String
        product_description: String
        main_category: String
        sub_category: String
        price: String
        link: String
        overall_rating: Float
        product_image: ProductImage
        product_info: ProductAdditionalInfo
    }

    type ProductImage {
        product_id: ID!
        image_url: String
        alt_text: String
        additional_info: String
    }

    type ProductAdditionalInfo {
        product_id: ID!
        choices: String
        additional_info: String
    }
    type Category {
        main_category: String
    }
    type Subcategory {
        sub_category: String
    }

    type Query {
        product(id: ID!): Product
        products: [Product]
        productImage(id: ID!): ProductImage
        productAdditionalInfo(id: ID!): ProductAdditionalInfo
        categories: [Category]
        subcategories: [Subcategory]
        getProductsBySearchTerm(term:String!): [Product]
        getProductsByPrice(maxPrice:Float, minPrice:Float): [Product]
        getProductsByCategory(category:String!): [Product]
        getProductsBySubcategory(subcategory:String!): [Product]
        getProductsByRating(ascending: Boolean, minRating:Float, maxRating:Float): [Product]
    }
`;

const resolvers = {
    Query: {
        product: (_, args) => db.prepare(
            `SELECT * FROM products WHERE products.id = ?`
        ).get(args.id),

        products: (_,) => db.prepare(
            `SELECT * FROM products`
        ).all(),

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
        
        
        getProductsBySearchTerm: (_,args) => db.prepare(
            `SELECT * FROM products
            WHERE product_name LIKE '%${args.term}%' OR product_sub_title LIKE '%${args.term}%' OR product_description LIKE '%${args.term}%'`
        ).all(),

        getProductsByCategory: (_,args) => db.prepare(
            `SELECT * FROM products
            WHERE main_category LIKE '%${args.category}%'`).all(),

        getProductsBySubcategory: (_,args) => db.prepare(
            `SELECT * FROM products
            WHERE sub_category LIKE '%${args.subcategory}%'`).all(),

        getProductsByPrice: (_, args) => { 
            // TODO: not in the signature rn
            const orderedby: String = args.ascending ? 'ASC' : 'DESC';
            const minPriceQuery: String = (!args.maxPrice && args.minPrice) ? `WHERE price >= ${args.minPrice}` : ""
            const maxPriceQuery: String = (args.maxPrice && !args.minPrice) ? `WHERE price <= ${args.maxPrice}` : ""
            const bothPriceQuery: String = (args.maxPrice && args.minPrice) ? `WHERE price <= ${args.maxPrice} AND price >= ${args.minPrice}` : ""
            return db.prepare(
            `SELECT * FROM products cast(price as float)
            ${minPriceQuery}
            ${bothPriceQuery}
            ${maxPriceQuery}`
        ).all()
        // ORDER BY price ${orderedby}
    },

        getProductsByRating: (_,args) => { 
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});

export default server.createHandler({
    cors: {
        origin: '*'
    },
});