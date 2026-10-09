import http from 'node:http';

const port = Number(process.env.EXCHANGE_RATE_MOCK_PORT || 5066);
const rates = {pen: 3.75, eur: 0.88, ars: 1500, brl: 5.2, clp: 950, cop: 4100, mxn: 18.2};

http.createServer((req, res) => {
  const match = req.url.match(/^\/(\d{4}-\d{2}-\d{2})\/usd\.json$/);
  if (!match) {
    res.writeHead(404);
    res.end('{}');
    return;
  }
  res.writeHead(200, {'content-type': 'application/json'});
  res.end(JSON.stringify({date: match[1], usd: rates}));
}).listen(port, () => console.log(`API de tipo de cambio de prueba en http://localhost:${port}`));
