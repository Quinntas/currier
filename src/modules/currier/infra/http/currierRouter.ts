import {Router} from "express";
import {post} from "../../../../core/handleRequest";
import {SendMessageUseCase} from "../../useCases/sendMessage/sendMessageUseCase";
import {userRateLimitMiddleware} from "../../../user/infra/middleware/userRateLimitMiddleware/userRateLimitMiddleware";

export const currierRouter: Router = Router();

post(currierRouter, '/sendMessage', SendMessageUseCase, [userRateLimitMiddleware])