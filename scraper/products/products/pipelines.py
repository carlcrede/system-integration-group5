import sqlite3

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from ftplib import FTP
from pathlib import Path

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
            
            self.cur.execute("""
                INSERT INTO product_images (product_id, image_url, alt_text, additional_info) VALUES (?, ?, ?, ?)
            """,
            (
                item['product_id'],
                item['image_url'],
                item['alt_text'],
                item['additional_info']
            ))

            ## Execute insert of data into database
            self.con.commit()
            
            
        if isinstance(item, ProductsAdditionalInfo):
            print('Processing additional info')
            
            self.cur.execute("""
                INSERT INTO products_additional_info (product_id, choices, additional_info) VALUES (?, ?, ?)
            """,
            (
                item['product_id'],
                item['choices'],
                item['additional_info']
            ))

            ## Execute insert of data into database
            self.con.commit()
        
        return item
    
    def close_spider(self, spider):
        print('Establishing FTP connection')
        file_path = Path('products.db')
        
        # TODO: replace by actual connection
        with FTP('server.address.com', 'USER', 'PWD') as ftp, open(file_path, 'rb') as file:
            ftp.storbinary(f'STOR {file_path.name}', file)
           
        print('FTP sending finished')