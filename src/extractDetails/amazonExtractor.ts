import { Extractor } from "./interfaces";

export const amazonExtractor: Extractor = ($) => {
	const name: string | null = $("h1").first().text().trim() ?? null;

	const price: string | null = (() => {
		const priceClassElements = $('[class*="price"]')
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
		if (!priceClassElements.length) return null;

		// Regex para capturar o preço no formato R$X.XXX,XX
		const priceRegex = /R\$\s*\d{1,99}(\.\d{3})*,\d{2}/;
		const match = priceClassElements.join(" ").match(priceRegex);
		return match ? match[0] : null;
	})();
	return { name, price };
};
