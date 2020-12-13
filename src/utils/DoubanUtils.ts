import superagent from "superagent";
import cheerio from "cheerio";
const ENDPOINT = "https://www.douban.com/search";

export interface Item {
    title: string;
    rate: number;
    author: string;
    description: string;
    type: string;
    pic: string | undefined;
    link: string | undefined;
}

const COOKIE = process.env["COOKIE"];
const USER_AGENT = process.env["USER_AGENT"];

async function crawlDoubanRate(bookName: string | any) {
    try {
        const searchResult = await superagent
            .get(ENDPOINT)
            .query({
                q: bookName,
            })
            .set({
                Cookie: COOKIE,
                "User-Agent": USER_AGENT,
            });
        const $ = cheerio.load(searchResult.text);
        const bookResults = $($(".search-result .result-list").toArray()[0]).children(".result");

        const result: Item[] = new Array();
        bookResults.each((index, element) => {
            const pic = $(element).children(".pic").children("a").children("img").attr("src");
            const head = $(element).children(".content").children(".title").children("h3");
            const info = $(element).children(".content").children(".title").children(".rating-info");

            const type = head.children("span").text().trim();
            const link = head.children("a").attr("href");
            const title = head.children("a").text().trim();
            const rate = parseFloat(info.children(".rating_nums").text().trim());
            const author = info.children(".subject-cast").text().trim();
            const description = $(element).children(".content").children("p").text().trim();
            result.push({
                type,
                title,
                rate,
                author,
                description,
                pic,
                link,
            });
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}

export { crawlDoubanRate };
