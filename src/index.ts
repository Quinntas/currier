import {createServer, IncomingMessage, ServerResponse} from 'node:http';

type Response = ServerResponse<IncomingMessage> & { req: IncomingMessage }

function jsonResponse<T>(res: Response, status: number, data: T) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

const server = createServer((req: IncomingMessage, res: Response) => {
    if (!req.url)
        return;

    switch (req.url) {
        case '/sendText':
            jsonResponse(res, 200, {message: 'Text sent'});
            break;
        case '/checkNumberStatus':
            jsonResponse(res, 200, {message: 'Number status checked'});
            break;
        default:
            jsonResponse(res, 404, {message: 'Not found'});
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
});

