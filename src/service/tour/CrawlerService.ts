

import axios from 'axios';
import cheerio from 'cheerio';
import Logger from "../../modules/middlewares/Logger";

export default class CrawlerService {

    public static async getCrawlerList(targetKeyword: string, sort: string, page: number): Promise<any[]> {

        try {
            interface Item {
                itemSeq: number;
                title: string;
                price: number;
                image: string;
                mallProductUrl: string;
                mobileItemPrice: number;
            }


            let target = encodeURIComponent(targetKeyword);

            const targetUrl =
                `https://search.shopping.naver.com/search/all?
                    frm=NVSCTAB&origQuery=${target}&pagingIndex=${page}&productSet=total
                    &query=${target}&sort=${sort}&timestamp=&viewType=list`;

            const response = await axios.get(targetUrl);

            const $ = cheerio.load(response.data);

            const items: Item[] = [];

            const scriptTag = $('script#__NEXT_DATA__').html();

            if (!scriptTag)
                return [false, "크롤러에 실패하였습니다.", null];


            const scriptData: any = JSON.parse(scriptTag);
            const productList: any = scriptData.props.pageProps.initialState.products.list || [];

            for(let productData of productList) {

                const itemSeq = productData.item.id;
                const itemUrl = productData.item.productName;
                const itemPrice = productData.item.price;
                const mobileItemPrice = productData.item.mobileLowPrice;
                const itemImage = productData.item.imageUrl;
                let mallProductUrl = productData.item.mallProductUrl;

                // 예외 처리
                mallProductUrl = mallProductUrl === undefined ? productData.item.adcrUrl : mallProductUrl;

                const itemData: Item = {
                    itemSeq:itemSeq,
                    title: itemUrl,
                    price: parseInt(itemPrice),
                    image: itemImage,
                    mallProductUrl: mallProductUrl,
                    mobileItemPrice: mobileItemPrice
                };

                items.push(itemData);

            }

            if(!items)
                return [false, "크롤러에 실패하였습니다.", null];

            return [true, "Crawler List", {itemList: items}];

        } catch (err) {
            Logger.error("getCrawlerList" + err);
            return [false, "크롤러에 실패하였습니다.", null];
        }
    }
}


