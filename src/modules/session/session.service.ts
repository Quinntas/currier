import {InsertSessionModel} from "./session.model";
import {SessionRepo} from "./session.repo";

export class SessionService {
    constructor(
        private readonly sessionRepo: SessionRepo
    ) {
    }

    create(session: InsertSessionModel) {
        return this.sessionRepo.create(session)
    }
}