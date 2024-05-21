import { ProductDetailsNullable } from "../types";

export interface Extractor {
	($: cheerio.Root): ProductDetailsNullable;
}

export type Domains = "aliexpress" | "amazon" | "guldi" | undefined;

export interface extractDetailsFunc {
	($: cheerio.Root, domain?: Domains): ProductDetailsNullable;
};
