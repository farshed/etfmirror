import { join } from 'path';

const sectorMap: any = {
	CEMENT: 'Cement',
	'AUTOMOBILE ASSEMBLER': 'Automobile',
	'OIL & GAS MARKETING COMPANIES': 'Oil & Gas',
	'TEXTILE COMPOSITE': 'Textile',
	PHARMACEUTICALS: 'Pharma',
	'FOOD & PERSONAL CARE PRODUCTS': 'Food',
	ENGINEERING: 'Engineering',
	'COMMERCIAL BANKS': 'Banking',
	REFINERY: 'Refinery',
	FERTILIZER: 'Fertilizer',
	'POWER GENERATION & DISTRIBUTION': 'Energy',
	'INV. BANKS / INV. COS. / SECURITIES COS.': 'Investment',
	'OIL & GAS EXPLORATION COMPANIES': 'Oil & Gas',
	'TECHNOLOGY & COMMUNICATION': 'Tech',
	'CABLE & ELECTRICAL GOODS': 'Electrical',
	CHEMICAL: 'Chemical'
};

export async function scrapePsxEtfs() {
	try {
		const response: any = await fetch(
			'https://beta-restapi.sarmaaya.pk/api/etf/list?page=1&limit=50'
		).then((r) => r.json());

		const etfList = (response?.response?.amcs ?? [])
			.filter((x: any) => !['HBLTETF'].includes(x.symbol))
			.map((x: any) => ({
				symbol: x.symbol,
				price: x.curr
			}));

		const symbols: any = await fetch('https://dps.psx.com.pk/symbols').then((r) => r.json());
		const stocks = (symbols ?? [])
			.filter((s: any) => !s.isDebt)
			.reduce((acc: Record<string, string>, s: any) => {
				acc[s.symbol] = s.sectorName;
				return acc;
			}, {});

		const result = [];

		for (const etf of etfList) {
			const url = `https://beta-restapi.sarmaaya.pk/api/etf/basket/${etf.symbol}`;
			const res: any = await fetch(url).then((r) => r.json());
			const constituents = (res?.response ?? [])
				.sort((a: any, b: any) => b.curr * b.volume - a.curr * a.volume)
				.map((x: any) => ({
					name: x.symbol,
					count: x.volume,
					sector: sectorMap[stocks[x.symbol]] ?? null
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
