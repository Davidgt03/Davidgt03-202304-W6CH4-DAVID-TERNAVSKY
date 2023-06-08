import http from 'http';
import url from 'url';
import * as dotenv from 'dotenv';
import { calculator } from './calculator.js';

dotenv.config();

const PORT = process.env.PORT || 4444;

const server = http.createServer((req, res) => {
  if (!req.url) {
    server.emit('error', new Error('No url in the request'));
    return;
  }

  const { pathname, query } = url.parse(req.url, true);

  if (req.method !== 'GET') {
    server.emit('error', new Error('Invalid method'));
    return;
  }

  if (pathname !== '/calculator') {
    res.statusCode = 404;
    res.end('Error. Not found.');
    return;
  }

  // eslint-disable-next-line radix
  const number1 = parseInt(query.number1 as string);
  // eslint-disable-next-line radix
  const number2 = parseInt(query.number2 as string);

  if (isNaN(number1) || isNaN(number2)) {
    res.statusCode = 400;
    res.end('Error. Invalid numbers/add numbers');
    return;
  }

  const results = calculator(number1, number2);

  res.write(`<h1>Calculadora</h1>`);
  res.write(`<p>${number1} + ${number2} = ${results.plus}</p>`);
  res.write(`<p>${number1} - ${number2} = ${results.minus}</p>`);
  res.write(`<p>${number1} * ${number2} = ${results.multiply}</p>`);
  res.write(`<p>${number1} / ${number2} = ${results.div}</p>`);
  res.end();
});

server.listen(PORT);

server.on('listening', () => {
  console.log('Listening on port ' + PORT);
});

server.on('error', (error) => {
  console.log(error.message);
});
