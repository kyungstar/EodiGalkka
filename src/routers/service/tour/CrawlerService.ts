
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import ResultBox from "../../dto/ResultBox";

import axios from 'axios';
import cheerio from 'cheerio';

export default class WorldService extends ResultBox {

    public static async crawlerList(travelSeq: number, targetKeyword: string, sort: string, page: number) {

        try {

            const travelCountUpdateResult = await DB.Executer(QM.Update("t_travel",{
                today_view_cnt: '\\today_view_cnt + 1',
                total_view_cnt: '\\total_view_cnt + 1',
            },{
                travel_seq: travelSeq
            }));

            if(!travelCountUpdateResult)
                return this.JustFalse('TN0');

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
            return this.JustErr(err);
        }
    }
}


