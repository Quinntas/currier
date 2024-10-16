import {server} from "./infra/server";
import {redis} from "./modules/shared";
import {sessionService} from "./modules/session";

server.listen(3000, '127.0.0.1', async () => {
    await redis.connect()
    await sessionService.loadSessions()
    console.log('Listening on 127.0.0.1:3000');
});
