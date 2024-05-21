import { Extractor } from "./interfaces";

export const guldiExtractor: Extractor = ($) => {
	const name: string | null = $("h1").first().text().trim() ?? null;

	const price: string | null = (() => {
		const priceElements = $("span.price")
			.map((_, el) => $(el).text().trim())
			.get()
			.filter((string) => !!string);
		if (!priceElements.length) return null;

		const priceRegex = /R\$\s*\d{1,99}(\.\d{3})*,\d{2}/;
		const match = priceElements.join(" ").match(priceRegex);
		return match ? match[0] : null;
	})();
	return { name, price };
};
