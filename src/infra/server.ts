import {createServer, IncomingMessage, ServerResponse} from 'node:http';
import {catchError} from "../utils/catchError";
import {userController} from "../modules/user";

export type HttpResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage }

export function jsonResponse<T>(res: HttpResponse, status: number, data: T) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

export function parseBody(req: IncomingMessage) {
    return new Promise<string>((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            resolve(body);
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
}

export function parseJsonBody<T>(req: IncomingMessage) {
    return catchError(parseBody(req).then((body) => {
        return JSON.parse(body) as T;
    }));
}

export const server = createServer((request: IncomingMessage, response: HttpResponse) => {
    if (!request.url)
        return;

    const reqIp = request.socket.remoteAddress;
    const logEntry = `${reqIp} - - [${new Date().toISOString()}] "${request.method} ${request.url} ${request.headers['user-agent']}"`;
    console.info(logEntry);

    switch (true) {
        case request.url === '/users' && request.method === 'POST':
            return userController.create(request, response);

        case request.url === '/users/login' && request.method === 'POST':
            return userController.login(request, response);

        default:
            return jsonResponse(response, 404, {message: 'Not found'});
    }
});