import {SessionService} from "./session.service";
import {IncomingMessage} from "node:http";
import {HttpResponse, jsonResponse, parseJsonBody} from "../../infra/server";
import {InsertUserModel} from "../user/user.model";
import {catchError} from "../../utils/catchError";
import {UserService} from "../user/user.service";

export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly userService: UserService
    ) {
    }

    async getQrCode(req: IncomingMessage, res: HttpResponse) {
        const token = req.headers.authorization;

        if (!token)
            return jsonResponse(res, 400, {message: 'Token not provided'});

        const splitToken = token.split(' ');

        if (splitToken.length !== 2)
            return jsonResponse(res, 400, {message: 'Invalid token'});

        if (splitToken[0] !== 'Bearer')
            return jsonResponse(res, 400, {message: 'Invalid token'});

        const [validateTokenError, user] = await catchError(this.userService.validateToken(splitToken[1]));

        if (validateTokenError)
            return jsonResponse(res, 401, {message: 'Invalid token'});

        const sessionTokenMatch = req.url?.match(/\/sessions\/([^\/]+)\/qr-code/);
        const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : null;

        if (!sessionToken)
            return jsonResponse(res, 400, {message: 'Session token not provided'});

        const [sessionError, session] = await catchError(this.sessionService.validateSession(sessionToken, user.id));
        if (sessionError)
            return jsonResponse(res, 500, {message: 'Internal server error'});

        const [serviceError, qrCode] = await catchError(this.sessionService.getQrCode(session));
        if (serviceError)
            return jsonResponse(res, 500, {message: 'Internal server error'});

        return jsonResponse(res, 200, qrCode);
    }

    async create(req: IncomingMessage, res: HttpResponse) {
        const token = req.headers.authorization

        if (!token)
            return jsonResponse(res, 400, {message: 'Token not provided'});

        const splitToken = token.split(' ')

        if (splitToken.length !== 2)
            return jsonResponse(res, 400, {message: 'Invalid token'});

        if (splitToken[0] !== 'Bearer')
            return jsonResponse(res, 400, {message: 'Invalid token'});

        const [validateTokenError, user] = await catchError(this.userService.validateToken(splitToken[1]))

        if (validateTokenError)
            return jsonResponse(res, 401, {message: 'Invalid token'});

        const [bodyError, body] = await parseJsonBody<InsertUserModel>(req);

        if (bodyError)
            return jsonResponse(res, 400, {message: 'Invalid JSON'});

        const [serviceError, _] = await catchError(this.sessionService.create({
            ownerId: user.id,
            name: body.name,
        }))

        if (serviceError) {
            console.error(serviceError)
            return jsonResponse(res, 500, {message: 'Internal server error'});
        }

        return jsonResponse(res, 201, {message: 'Created'});
    }
}