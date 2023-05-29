
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import ResultBox from "../../dto/ResultBox";

import axios from 'axios';
import cheerio from 'cheerio';

export default class WorldService extends ResultBox {

    public static async crawlerList(countrySeq: number, sort: string, page: number) {

        try {

            interface Item {
                itemSeq: number;
                title: string;
                price: number;
                image: string;
                mallProductUrl: string;
                mobileItemPrice: number;
            }

            let continentsData = await DB.getOne(QM.Select("t_country",{country_seq: countrySeq},{}, ["*"]));

            if(!continentsData)
                return this.JustFalse('CN0');

            let target = encodeURIComponent(continentsData.country_name + '패키지');

            const targetUrl =
                `https://search.shopping.naver.com/search/all?frm=NVSCTAB&origQuery=${target}&pagingIndex=${page}&productSet=total&query=${target}&sort=${sort}&timestamp=&viewType=list`;

            const response = await axios.get(targetUrl);

            const $ = cheerio.load(response.data);

            const items: Item[] = [];

            const scriptTag = $('script#__NEXT_DATA__').html();


            if (!scriptTag)
                return this.JustFalse('WN0');

            const scriptData = JSON.parse(scriptTag);
            const productList = scriptData?.props?.pageProps?.initialState?.products?.list || [];

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

            if(items)
                return this.ObjTrue('WN0', [{itemList: items}]);
            else
                return this.JustFalse('WN0');

        } catch (err) {

        }
    }
}


