import {UserService} from "./user.service";
import {IncomingMessage} from "node:http";
import {InsertUserModel} from "./user.model";
import {catchError} from "../../utils/catchError";
import {HttpResponse, jsonResponse, parseJsonBody} from "../../infra/server";

export class UserController {
    constructor(
        private readonly userService: UserService
    ) {
    }

    async create(req: IncomingMessage, res: HttpResponse) {
        const [bodyError, body] = await parseJsonBody<InsertUserModel>(req);

        if (bodyError)
            return jsonResponse(res, 400, {message: 'Invalid JSON'});

        const [serviceError, _] = await catchError(this.userService.create({
            email: body.email,
            password: body.password,
            name: body.name
        }))

        if (serviceError) {
            console.error(serviceError)
            return jsonResponse(res, 500, {message: 'Internal server error'});
        }

        return jsonResponse(res, 201, {message: 'Created'});
    }

    async login(req: IncomingMessage, res: HttpResponse) {
        const [bodyError, body] = await parseJsonBody<InsertUserModel>(req);

        if (bodyError)
            return jsonResponse(res, 400, {message: 'Invalid JSON'});

        const [serviceError, loginRes] = await catchError(this.userService.login(body.email, body.password));

        if (serviceError) {
            console.error(serviceError)
            return jsonResponse(res, 500, {message: 'Internal server error'});
        }

        return jsonResponse(res, 200, loginRes);
    }
}