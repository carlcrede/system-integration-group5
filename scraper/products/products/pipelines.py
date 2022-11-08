import sqlite3

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

from .items import ProductImagesItem, ProductsAdditionalInfo, ProductsItem


class SqlitePipeline:
    def __init__(self) -> None:
        # create/connect to db
        self.con = sqlite3.connect('products.db')
        
        # create cursor, which is used to execute commands
        self.cur = self.con.cursor()
        
        # create products table
        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS products(
            id INTEGER NOT NULL PRIMARY KEY,
            product_name TEXT,
            product_sub_title TEXT,
            product_description TEXT,
            main_category TEXT,
            sub_category TEXT,
            price TEXT,
            link TEXT,
            overall_rating INTEGER
        )
        """)
        
        # create product_images table
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS product_images(
                product_id INTEGER,
                image_url TEXT,
                alt_text TEXT,
                additional_info TEXT,
                PRIMARY KEY (product_id, alt_text),
                FOREIGN KEY (product_id) REFERENCES products (id) 
                    ON DELETE CASCADE
            )
        """)
        
        # create products_additional_info table
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS products_additional_info(
                product_id INTEGER,
                choices TEXT,
                additional_info TEXT,
                PRIMARY KEY (product_id, choices),
                FOREIGN KEY (product_id) REFERENCES products (id) 
                    ON DELETE CASCADE
            )
        """)
        
    def process_item(self, item, spider):
        if isinstance(item, ProductsItem):
            print('Processing product')
            ## Define insert statement
            self.cur.execute("""
                INSERT INTO products (id, product_name, product_sub_title, product_description,
                main_category, sub_category, price, link, overall_rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                item['id'],
                item['product_name'],
                item['product_sub_title'],
                item['product_description'],
                item['main_category'],
                item['sub_category'],
                item['price'],
                item['link'],
                item['overall_rating']
            ))
            ## Execute insert of data into database
            self.con.commit()
            
        if isinstance(item, ProductImagesItem):
            print('Processing image')
        if isinstance(item, ProductsAdditionalInfo):
            print(' Processingadditional info')
        
        return item
