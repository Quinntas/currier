import {server} from "./infra/server";
import {redis} from "./modules/shared";

server.listen(3000, '127.0.0.1', async () => {
    await redis.connect()

    console.log('Listening on 127.0.0.1:3000');
});
