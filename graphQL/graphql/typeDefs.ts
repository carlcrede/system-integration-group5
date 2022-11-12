import { gql } from 'apollo-server-azure-functions';

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
        getProductsByPrice(ascending: Boolean, maxPrice:Float, minPrice:Float): [Product]
        getProductsByCategory(category:String!): [Product]
        getProductsBySubcategory(subcategory:String!): [Product]
        getProductsByRating(ascending: Boolean, minRating:Float, maxRating:Float): [Product]
    }

    type Subscription {
        newDatabase: String!
    }
`;

export default typeDefs;