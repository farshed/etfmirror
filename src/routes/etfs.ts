import { join } from 'path';

const ALLOWED_ORIGINS = new Set([
	'https://etfmirror.farshed.me',
	// local development
	'http://localhost:5100',
	'http://localhost:5173'
]);

function corsHeaders(origin: string | null): Record<string, string> {
	if (origin && ALLOWED_ORIGINS.has(origin)) {
		return {
			'Access-Control-Allow-Origin': origin,
			Vary: 'Origin'
		};
	}
	return { Vary: 'Origin' };
}

export async function listETFs(req: Request) {
	const origin = req.headers.get('origin');

	// Reject cross-origin requests from any domain that isn't allow-listed.
	if (origin && !ALLOWED_ORIGINS.has(origin)) {
		return Response.json({ error: 'origin not allowed' }, { status: 403 });
	}

	try {
		const file = Bun.file(join(process.cwd(), 'etf_list.json'));
		return new Response(file, {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders(origin)
			}
		});
	} catch (err) {
		console.error(err);
		return Response.json(
			{ error: 'an error occured' },
			{ status: 500, headers: corsHeaders(origin) }
		);
	}
}
