import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {ErrorRequestHandler, Request, RequestHandler, Response, Router} from "express";
import {parse} from "querystring";
import {HttpError} from "./errors";
import {jsonResponse} from "./responses";
import {Result, SpectreError} from "spectre-orm";
import {wrapMiddlewares} from "./middleware";

export function handleError(res: Response, error: Error) {
    if (error instanceof HttpError) {
        return jsonResponse(
            res,
            error.code,
            {message: error.message, ...error.body}
        );
    } else if (error instanceof Result) {
        switch (error.errorType) {
            case SpectreError.DATABASE_DUPLICATE_ENTRY:
                return jsonResponse(res, 409, {message: "Duplicate entry"});
            case SpectreError.DATABASE_WRONG_VALUE:
            case SpectreError.DATABASE_BAD_REQUEST:
            case SpectreError.DATABASE_INTERNAL_ERROR:
                return jsonResponse(res, 500, {message: "Database internal error"});
        }
    }

    console.log(error)

    return jsonResponse(res, 500, {message: "Internal server error"});
}

export async function handleRequest<iBody extends object, iQuery extends object>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    handler: Function,
) {
    switch (req.headers["content-type"]) {
        case "application/json;charset=utf-8":
        case "application/json":
            req.bodyObject = req.body;
            break;
    }

    req.queryObject = parse(req.url.split("?")[1]) as iQuery;

    try {
        return await handler(req, res);
    } catch (error) {
        return handleError(res, error);
    }
}

export function get<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    handler: Function,
    middlewares: (RequestHandler | ErrorRequestHandler)[] = []
) {
    const wrappedMiddlewares = wrapMiddlewares<iBody, iQuery>(middlewares);

    router.get(path, wrappedMiddlewares, (req: Request, res: Response) => {
        handleRequest<iBody, iQuery>(
            req as DecodedExpressRequest<iBody, iQuery>,
            res,
            handler
        );
    });
}

export function post<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    handler: Function,
    middlewares: (RequestHandler | ErrorRequestHandler)[] = []
) {
    const wrappedMiddlewares = wrapMiddlewares<iBody, iQuery>(middlewares);

    router.post(path, (req: Request, res: Response) => {
        handleRequest<iBody, iQuery>(
            req as DecodedExpressRequest<iBody, iQuery>,
            res,
            handler
        );
    });
}
