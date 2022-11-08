# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import sqlite3

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


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
        return item
