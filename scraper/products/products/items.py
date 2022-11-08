# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ProductsItem(scrapy.Item):
    id = scrapy.Field()
    product_name = scrapy.Field()
    product_sub_title = scrapy.Field()
    product_description = scrapy.Field()
    main_category = scrapy.Field()
    sub_category = scrapy.Field()
    price = scrapy.Field()
    link = scrapy.Field()
    overall_rating = scrapy.Field()

class ProductImagesItem(scrapy.Item):
    product_id = scrapy.Field()
    image_url = scrapy.Field()
    alt_text = scrapy.Field()
    additional_info = scrapy.Field() # main photo or gallery

class ProductsAdditionalInfo(scrapy.Item):
    product_id = scrapy.Field()
    choices = scrapy.Field() # product-related choices - size, quantity, colors, etc.
    additional_info = scrapy.Field() # can indicate availability for a choice
