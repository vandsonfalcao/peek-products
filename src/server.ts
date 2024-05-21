import cheerio from "cheerio";
import puppeteer, { Browser } from "puppeteer";
import { inspect } from "util";
import { extractDetails } from "./extractDetails";
import { ProductDetails } from "./types";
import { Domains } from "./extractDetails/interfaces";

type GetProductDetailsFunc = {
	(url: string, domain?: Domains): Promise<ProductDetails | null>;
};
const getProductDetails: GetProductDetailsFunc = async (url, domain = undefined) => {
	let browser: Browser | null = null;
	try {
		browser = await puppeteer.launch();
		if (!browser) throw new Error("Cant launch a browser");

		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle2" });
		const pageContent = await page.content();
		const $ = cheerio.load(pageContent);
		const { name, price } = extractDetails($, domain);
		if (!name) throw new Error("Nome do produto não encontrado.");
		if (!price) throw new Error("Preço do produto não encontrado.");
		return { name, price };
	} catch (error: any) {
		console.error({
			message:
				"Erro ao obter detalhes do produto, tente especificar especificando o domain da url",
			error: inspect(error, { depth: 10 }),
		});
		return null;
	} finally {
		if (browser) await browser.close();
	}
};

const response = await getProductDetails(`

https://pt.aliexpress.com/item/1005004685937716.html?pdp_npi=4%40dis%21USD%21US%20%2463.33%21US%20%2436.73%21%21%2163.33%2136.73%21%402103080817098383227422216eeb97%2112000030127057220%21sh%21BR%21180738135%21&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007539327050.1005004685937716&aff_fcid=63e9cbfdc08440189cdfc82176db9880-1716057861608-05930-_Dl6LAN7&tt=CPS_NORMAL&aff_fsk=_Dl6LAN7&aff_platform=portals-tool&sk=_Dl6LAN7&aff_trace_key=63e9cbfdc08440189cdfc82176db9880-1716057861608-05930-_Dl6LAN7&terminal_id=5c867179f201423d83e49d0dd3fdf652&afSmartRedirect=y&gatewayAdapt=glo2bra

`, `aliexpress`);
console.log(response);
