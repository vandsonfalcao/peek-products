import { Extractor } from "./interfaces";

export const aliexpressExtractor: Extractor = ($) => {
	const name: string | null = (() => {
		const h1Elements = $("h1")
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
		if (!h1Elements.length) return null;

		return h1Elements[1];
	})();

	const price: string | null = (() => {
		const priceClassElements = $('[class*="price"]')
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
		if (!priceClassElements.length) return null;
		return priceClassElements[1];
	})();
	return { name, price };
};
