import { Extractor } from "./interfaces";

export const defaultExtractor: Extractor = ($) => {
	const name: string | null = (() => {
		// faze um metodo para cada site e ter um default
		const metaElements = $('[property="og:title"]')
			.map((_, el) => $(el).attr("content")?.trim() ?? "")
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

	const price: string | null = (() => {
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
	return { name, price };
};
