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
        price: Float
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

    type Query {
        product(id: ID!): Product
        products: [Product]
        productImage(id: ID!): ProductImage
        productAdditionalInfo(id: ID!): ProductAdditionalInfo
        getProductsBySearchTerm(term:String!): [Product]
        getProductsByPrice(maxPrice:Float, minPrice:Float): [Product]
    }
`;

// TODO: categories, subcategories, getProductsby(sub)category, getProductByRating(int 0-100)

const resolvers = {
    Query: {
        product: (_, args) => db.prepare(
            `SELECT * FROM products WHERE products.id = ?`
        ).get(args.id),

        products: (_,) => db.prepare(
            `SELECT * FROM products`
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

        // TODO: this doesnot work, line 53 consider adding the boolean back, changed to args here, query looks good, but returns null, works in Datagrip
        getProductsByPrice: (_, args) => { 
            const orderedby: String = args.ascending ? 'ASC' : 'DESC';
            const minPriceQuery: String = (!args.maxPrice && args.minPrice) ? `WHERE price >= ${args.minPrice}` : ""
            const maxPriceQuery: String = (args.maxPrice && !args.minPrice) ? `WHERE price <= ${args.maxPrice}` : ""
            const bothPriceQuery: String = (args.maxPrice && args.minPrice) ? `WHERE price <= ${args.maxPrice} AND price >= ${args.minPrice}` : ""
            db.prepare(
            `SELECT * FROM products
            ${minPriceQuery}
            ${bothPriceQuery}
            ${maxPriceQuery}
            ORDER BY price ${orderedby}`
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