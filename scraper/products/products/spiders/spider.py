from products.items import ProductsItem, ProductImagesItem, ProductsAdditionalInfo
import scrapy

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:106.0) Gecko/20100101 Firefox/106.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    # Do Not Track
    'DNT': '1',
    'Connection': 'keep-alive',
    'Cookie': 'SSLB=1; ipcuid=01aanmv900l9ydmrsv; sessionid=1667317234-8d890243-eda8-acb4-c307-a9a3f9ba0ec8; JSESSIONID=4F9C16BFFDB7644A8A4E2E129535CBE4; ak_bmsc=7E424FB4C663943032D3C0DA8D91F2C4~000000000000000000000000000000~YAAQdptkXxGDJ/+DAQAAE2rjMxHw4pIUwSIfYgUbzgTeJPNTRkl5pWhSOthLvusbBH4p+x6clzsSv0ecUqm6bEmoXMBJIfn6Ui+7jNj7aZLIEHoGW4ZS14PKTgZWxdOWwk16Yps2BX+Fs3Cb4l2/zagIIt2mXEZKyCmb+SgCWZ+nEIQU9VlJJnk4p4POSQq0xEPSPZ0G8EmcGc/0vst5JVzRGZTXN4JUcw39u4fHJ/b21cbkcMCTHS8L+2CKQ+MH7hx5hybtDmn1tweByVUiQQCmeOSKCr/qvvd7a4UlMWea3…B33F448096C2230ACB7095D~YAAQjJtkXwTn+hyEAQAAdFLjMxFjHltwHaG6gUKLuz/wFoPWraEZ38yBjM2ZvPvF02grjUWifOaa5XRw/XMJqG/ohuEjpY6BWDXzB9fobzr5DDI+TBBcFpA2BSi5u+NAXb5gjKa23oCSxDBSuTLTHqY/Dk+rW5nk7EzC/JQBCkYgwcow7oHUZgxxcUGHwA0ogKSbRmwp0rt4qKAAdILoMSiKaBvaOgyoKCFLQWZ0r7ERWBjnBzr/wp2lwOYKuEfI7qV+680vuUHYuw62wBIA3M6CZHRvHZEOWZNervshMmgU+p/n0npJaHX53XYZO0xryJ63wqujKTHit4v/SED4huOLruCgEzn/h+aOCijmhjEvuIg=~1; consentUUID=876cae50-7b62-42fe-8504-a251faeb6c74_13; _sp_v1_opt=1:login|true:last_id|13:; _sp_v1_csv=; _sp_v1_lt=1:',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-GPC': '1',
    # 'Cache-Control': 'max-age=0',
    # Requests doesn't support trailers
    # 'TE': 'trailers',
}

class ItemSpider(scrapy.Spider):
    name = "spider"

    download_delay = 1
    RANDOMIZE_DOWNLOAD_DELAY = True
    CONCURRENT_REQUESTS = 1
    
    def start_requests(self):
        urls = [
            'https://www.idealo.co.uk/cat/7712/',
            'https://www.idealo.co.uk/pcat/3011/',
            'https://www.idealo.co.uk/pcat/4312/',
            'https://www.idealo.co.uk/cat/9132/',
            'https://www.idealo.co.uk/cat/3406/',
            'https://www.idealo.co.uk/cat/6392/',
            'https://www.idealo.co.uk/cat/6773/'
        ]
        for url in urls:
            yield scrapy.Request(url=url, headers=headers, callback=self.parse)

    def parse(self, response):
        for product in response.css('div.offerList-item'):
            product_id = product.attrib['data-sp-itemid']
            product_rating_classes = product.css('div.rating-stars').xpath("@class").extract()
            rating = None
            if len(product_rating_classes) > 0:
                found_class = product_rating_classes[0].replace('rating-stars rating-stars--', '')
                assert str(found_class).isnumeric()
                rating = int(found_class)

            item = ProductsItem()
            item['id'] = product_id
            item['link'] = "https://www.idealo.co.uk/compare/" + product_id
            item['product_name'] = product.css('div.offerList-item-description div::text').get().strip()
            item['price'] = product.css('div.offerList-item-priceMin::text').extract()[1].strip()
            item['product_sub_title'] = product.css('span.description-part-one::text').get()
            item['product_description'] = product.css('span.description-part-two::text').get()
            item['overall_rating'] = rating
            item['main_category'] = response.css('div.breadcrumb span')[-1].css('span.breadcrumb-linkText::text').get().strip()
            item['sub_category'] = response.css('h1.offerList-title::text').get()
            yield item
            yield scrapy.Request(url="https://www.idealo.co.uk/compare/"+product_id, headers=headers, callback=self.parse_item)

    def parse_item(self, response):
        # TODO: implement missing items
        photo_item = ProductImagesItem()
        choices_item = ProductsAdditionalInfo()
        title = response.css('h1.oopStage-title span::text').get()
        yield {title: title}