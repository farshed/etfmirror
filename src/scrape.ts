import { join } from 'path';

export async function scrapePsxEtfs() {
	try {
		const response: any = await fetch(
			'https://beta-restapi.sarmaaya.pk/api/etf/list?page=1&limit=50'
		).then((r) => r.json());

		const etfList = (response?.response?.amcs ?? [])
			.filter((x: any) => ['HBLTETF'].includes(x.symbol))
			.map((x: any) => ({
				symbol: x.symbol,
				price: x.curr
			}));

		const result = [];

		for (const etf of etfList) {
			const url = `https://beta-restapi.sarmaaya.pk/api/etf/basket/${etf.symbol}`;
			const res: any = await fetch(url).then((r) => r.json());
			const constituents = (res?.response ?? []).map((x: any) => ({
				name: x.symbol,
				count: x.volume
			}));

			result.push({ name: etf.symbol, price: etf.price, constituents });
		}

		await Bun.write(join(process.cwd(), 'etf_list.json'), JSON.stringify(result));
	} catch (err) {
		console.error('etfmirror', err);
	}
}

// import * as cheerio from 'cheerio';

// interface CompanyHolding {
// 	symbol: string;
// 	shares: number;
// }

// function extractSymbolsAndShares(html: string): CompanyHolding[] {
// 	const $ = cheerio.load(html);
// 	const results: CompanyHolding[] = [];

// 	$('.etfCub__modal .tbl__body tr').each((_, row) => {
// 		const symbol = $(row).find('.tbl__symbol strong').text().trim();
// 		const shares = parseInt($(row).find('td.right').text().trim(), 10);

// 		if (symbol && !isNaN(shares)) {
// 			results.push({ symbol, shares });
// 		}
// 	});

// 	return results;
// }
