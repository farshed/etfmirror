import { join } from 'path';

export async function listETFs() {
	try {
		const etfList = await Bun.file(join(process.cwd(), 'etf_list.json')).json();
		return Response.json(etfList);
	} catch (err) {
		console.error(err);
		return Response.json({ error: 'an error occured' }, { status: 500 });
	}
}
