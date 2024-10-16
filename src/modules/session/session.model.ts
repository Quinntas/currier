import {sessionTable} from "./session.table";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";

export type SelectSessionModel = InferSelectModel<typeof sessionTable>

export type InsertSessionModel = InferInsertModel<typeof sessionTable>