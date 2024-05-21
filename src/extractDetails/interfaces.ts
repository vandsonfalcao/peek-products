import { ProductDetailsNullable } from "../types";

export interface Extractor {
	($: cheerio.Root): ProductDetailsNullable;
}

export type Domains = "aliexpress" | "amazon" | undefined;

export interface extractDetailsFunc {
	($: cheerio.Root, domain?: Domains): ProductDetailsNullable;
};
