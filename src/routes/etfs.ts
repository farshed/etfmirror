import { join } from 'path';

export async function listETFs() {
	try {
		const file = Bun.file(join(process.cwd(), 'etf_list.json'));
		return new Response(file, { headers: { 'Content-Type': 'application/json' } });
	} catch (err) {
		console.error(err);
		return Response.json({ error: 'an error occured' }, { status: 500 });
	}
}
