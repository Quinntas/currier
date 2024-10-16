import {defineConfig} from "drizzle-kit";
import {env} from "./src/utils/env";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/modules/**/*.table.ts",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});