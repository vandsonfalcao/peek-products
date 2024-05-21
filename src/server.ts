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

https://www.guldi.com.br/produto/colchao-guldi/?attribute_1-tamanho-do-colchao=Queen+-+158+x+198+x+25+cm&attribute_2-modelo=Macio+D30

`, 'guldi');
console.log(response);
