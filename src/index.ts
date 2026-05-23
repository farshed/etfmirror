import { join } from 'path';
import { listETFs } from './routes/etfs';
import { scrapePsxEtfs } from './scrape';

const dist = join(process.cwd(), 'app', 'dist');
const indexHtml = Bun.file(join(dist, 'index.html'));

const server = Bun.serve({
	port: 5100,
	routes: {
		'/api/etfs': { GET: listETFs }
	},
	fetch: (req) => {
		const url = new URL(req.url);
		const { pathname } = url;

		if (pathname === '/') {
			return new Response(indexHtml);
		}

		let file = Bun.file(join(dist, pathname));
		if (file.size > 0) return new Response(file);

		file = Bun.file(join(dist, pathname, 'index.html'));
		if (file.size > 0) return new Response(file);

		return new Response(indexHtml);
	}
});

console.log(`Server running at http://${server.hostname}:${server.port}`);

Bun.cron('* * * * *', async () => {
	await scrapePsxEtfs();
});
