import scrapy
import time
from products.items import ProductsItem, ProductImagesItem, ProductsAdditionalInfo


class ItemSpider(scrapy.Spider):
    name = "spider"

    download_delay = 1
    RANDOMIZE_DOWNLOAD_DELAY = True
    CONCURRENT_REQUESTS = 1
    
    def start_requests(self):
        urls = [
            'https://www.pricerunner.dk/cl/1/Mobiltelefoner?page=1',
            'https://www.pricerunner.dk/cl/25/Skaerme?page=1'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for product in response.css('div.k6oEmfY83J'):
            is_loaded = product.css('a')
            
            if not is_loaded:
                break
            
            link = is_loaded.attrib['href']
            full_link = "https://www.pricerunner.dk" + link
            product_id=link.split('/')[2]

            item = ProductsItem()
            item['id'] = product_id
            item['link'] = full_link
            item['product_name'] = product.css('h3.pr-7iigu3::text').get().strip()
            item['price'] = product.css('span.pr-be5x0o::text').get().replace('\xa0', ' ')
            item['product_sub_title'] = product.css('p.pr-13b83wt::text').get() or ''
            item['product_description'] = ''
            item['overall_rating'] = response.css('p.pr-1ob9nd8::text').get()
            item['main_category'] = response.css('a.EWsqM2HIwb')[1].css('span::text').get().strip()
            item['sub_category'] = response.css('h1.KeWWdsnAoz.pr-lilhn6::text').get()
            yield item
            time.sleep(0.2) 
            yield scrapy.Request(
                url=full_link,
                callback=self.parse_item,
                cb_kwargs=dict(product_id=product_id))

    def parse_item(self, response, product_id):
        multiple_images = response.css('div.BFNH1tCHJ1')
        if multiple_images:
            for index, image in enumerate(multiple_images.css('img')):
                photo_item = ProductImagesItem()
                photo_item['product_id'] = product_id
                photo_item['image_url'] = image.attrib['src']
                photo_item['alt_text'] = image.attrib['alt']
                photo_item['additional_info'] = 'main' if index == 0 else 'gallery' 
                yield photo_item
        else:
            image = response.css('img.xUAmIg3IAt')
            photo_item = ProductImagesItem()
            photo_item['product_id'] = product_id
            photo_item['image_url'] = image.attrib['src']
            photo_item['alt_text'] = image.attrib['alt']
            photo_item['additional_info'] = 'main'
            yield photo_item
        
        for variant in response.css('div.foWwRfeBAj'):
            choices_item = ProductsAdditionalInfo()
            choices_item['product_id'] = product_id
            choices_item['choices'] = variant.css('p.TcotvmRfKA::text').get()
            choices_item['additional_info'] = variant.css('span.EuM6bPW_EW::text').get().replace('\xa0', ' ') #price
            yield choices_item