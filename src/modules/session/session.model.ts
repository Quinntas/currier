import {sessionTable} from "./session.table";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";

export type SessionModelStatusEnum = "ACTIVE" | "INACTIVE" | "EXPIRED" | "DELETED"

interface SessionModel {
    status: SessionModelStatusEnum
}

export type InsertSessionModel = InferInsertModel<typeof sessionTable> & SessionModel

export type SelectSessionModel = InferSelectModel<typeof sessionTable> & SessionModel