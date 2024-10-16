import {userTable} from "./user.table";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";

export type SelectUserModel = InferSelectModel<typeof userTable>

export type InsertUserModel = InferInsertModel<typeof userTable>