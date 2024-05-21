import { ProductDetailsNullable } from "../types";
import { aliexpressExtractor } from "./aliexpressExtractor";
import { amazonExtractor } from "./amazonExtractor";
import { defaultExtractor } from "./defaultExtractor";
import { extractDetailsFunc } from "./interfaces";

export const extractDetails: extractDetailsFunc = ($, domain = undefined) => {
	let productDetailsNullable: ProductDetailsNullable = { name: null, price: null };
	switch (domain) {
		case "aliexpress":
			productDetailsNullable = aliexpressExtractor($);
			break;
		case "amazon":
			productDetailsNullable = amazonExtractor($);
			break;

		default:
			productDetailsNullable = defaultExtractor($);
			break;
	}
	return productDetailsNullable;
};
