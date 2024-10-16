import {SessionService} from "./session.service";

export class SessionController {
    constructor(
        private readonly sessionService: SessionService
    ) {
    }
}