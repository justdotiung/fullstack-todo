import http, {IncomingMessage, ServerResponse} from 'http';

const PORT = 5000;
const server = http.createServer((req:IncomingMessage, res:ServerResponse) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("hello")
})

server.listen(PORT, () => {
    console.log("hello")
})