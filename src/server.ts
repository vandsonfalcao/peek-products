import puppeteer, { Browser } from "puppeteer";
import cheerio from "cheerio";
import { inspect } from "util";

interface ProductDetails {
	name: string;
	price: string;
}
async function getProductDetails(url: string): Promise<ProductDetails | null> {
	let browser: Browser | null = null;
	try {
		browser = await puppeteer.launch();
		if (!browser) throw new Error("Cant launch a browser");

		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle2" });
		const pageContent = await page.content();
		const $ = cheerio.load(pageContent);

		const productName: string | null = (() => {
			// faze um metodo para cada site e ter um default
			const metaElements = $('[property="og:title"]')
				.map((_, el) => $(el).attr('content')?.trim() ?? '')
				.get()
				.filter((string) => !!string);
			const h1Elements = $("h1")
				.map((_, el) => $(el).text().trim())
				.get()
				.filter((string) => !!string);
			const primaryArray = [...metaElements, ...h1Elements];

			const idProductElements = $('[id*="product"]')
				.map((_, el) => $(el).text().trim())
				.get()
				.filter((string) => !!string);
			const idTitleProductElements = $('[id*="title"]')
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
			const classProductElements = $('[class*="product"]')
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
			const classTitleProductElements = $('[class*="title"]')
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
			const secondaryArray = [
				...idProductElements,
				...idTitleProductElements,
				...classProductElements,
				...classTitleProductElements,
			];

			// const usedArray = primaryArray.length ? primaryArray : secondaryArray;
			const usedArray = [...primaryArray, ...secondaryArray];
			if (!usedArray.length) return null;

			let winner = null;
			let occurrenceCounter = -1;

			for (let i = 0; i < usedArray.length; i++) {
				let occurrences = 1;
				for (let t = i + 1; t < usedArray.length; t++)
					if (usedArray[i] == usedArray[t]) occurrences++;

				if (occurrences > occurrenceCounter) {
					winner = usedArray[i];
					occurrenceCounter = occurrences;
				}
			}

			return !!winner ? winner : null;
		})();

		const productPrice: string | null = (() => {
			const price$Elements = $('span:contains("R$")')
				.map((_, el) => $(el).text().trim())
				.get()
				.filter((string) => !!string);
			const priceIdElements = $('[id*="price"]')
				.map((_, el) => $(el).text().trim())
				.get()
				.filter((string) => !!string);
			const priceClassElements = $('[class*="price"]')
				.map((_, el) => $(el).text().trim())
				.get()
				.filter((string) => !!string);
			const priceStringArray = [...priceClassElements, ...priceIdElements, ...price$Elements];
			if (!priceStringArray.length) return null;

			// Regex para capturar o preço no formato R$X.XXX,XX
			const priceRegex = /R\$\s*\d{1,99}(\.\d{3})*,\d{2}/;
			const match = priceStringArray.join(" ").match(priceRegex);
			return match ? match[0] : null;
		})();

		if (!productName) throw new Error("Nome do produto não encontrado.");
		if (!productPrice) throw new Error("Preço do produto não encontrado.");
		return { name: productName, price: productPrice };
	} catch (error: any) {
		console.error({
			message: "Erro ao obter detalhes do produto",
			error: inspect(error, { depth: 10 }),
		});
		return null;
	} finally {
		if (browser) await browser.close();
	}
}

const response = await getProductDetails(`

https://pt.aliexpress.com/item/1005004685937716.html?pdp_npi=4%40dis%21USD%21US%20%2463.33%21US%20%2436.73%21%21%2163.33%2136.73%21%402103080817098383227422216eeb97%2112000030127057220%21sh%21BR%21180738135%21&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007539327050.1005004685937716&aff_fcid=63e9cbfdc08440189cdfc82176db9880-1716057861608-05930-_Dl6LAN7&tt=CPS_NORMAL&aff_fsk=_Dl6LAN7&aff_platform=portals-tool&sk=_Dl6LAN7&aff_trace_key=63e9cbfdc08440189cdfc82176db9880-1716057861608-05930-_Dl6LAN7&terminal_id=5c867179f201423d83e49d0dd3fdf652&afSmartRedirect=y&gatewayAdapt=glo2bra

`);
console.log(response);
