import {Router} from "express";
import {userRouter} from "../../modules/user/infra/http/userRouter";

export const v1Router: Router = Router();

v1Router.use('/user', userRouter)