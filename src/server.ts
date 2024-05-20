import axios from "axios";
import cheerio from "cheerio";
import { inspect } from "util";

interface ProductDetails {
	name: string;
	price: string;
}

async function getProductDetails(url: string): Promise<ProductDetails | null> {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		// Exemplo de extração de nome e preço (ajuste conforme necessário)
		const productName = $('meta[property="og:title"]').attr("content") || $("title").text();
		const productPrice =
			$('meta[property="product:price:amount"]').attr("content") || $(".price").text();

		if (productName && productPrice) {
			return { name: productName.trim(), price: productPrice.trim() };
		} else {
			throw new Error("Nome ou preço do produto não encontrados.");
		}
	} catch (error: any) {
		console.error({
			message: "Erro ao obter detalhes do produto",
			error: inspect(error, { depth: 10 }),
		});
		return null;
	}
}

// Testando a função com uma URL de exemplo
getProductDetails("https://a.co/d/6g6jOn4").then((details) => {
	if (details) {
		console.log(`Nome do Produto: ${details.name}`);
		console.log(`Preço do Produto: ${details.price}`);
	}
});
