import {UserService} from "./user.service";
import {UserRepo} from "./user.repo";
import {db} from "../shared/database";
import {userTable} from "./user.table";
import {UserController} from "./user.controller";
import {redis} from "../shared";

export const userRepo = new UserRepo(db, userTable, redis)

export const userService = new UserService(userRepo, redis)

export const userController = new UserController(userService)