import {SessionService} from "./session.service";
import {SessionRepo} from "./session.repo";
import {sessionTable} from "./session.table";
import {db} from "../shared/database";
import {SessionController} from "./session.controller";

export const sessionRepo = new SessionRepo(db, sessionTable)

export const sessionService = new SessionService(sessionRepo)

export const sessionController = new SessionController(sessionService)