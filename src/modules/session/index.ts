import {SessionService} from "./session.service";
import {SessionRepo} from "./session.repo";
import {sessionTable} from "./session.table";
import {db} from "../shared/database";
import {SessionController} from "./session.controller";
import {userService} from "../user";
import {redis} from "../shared";

export const sessionRepo = new SessionRepo(db, sessionTable, redis)

export const sessionService = new SessionService(sessionRepo)

export const sessionController = new SessionController(sessionService, userService)