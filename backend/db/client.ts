import Database from "better-sqlite3";
import { CREATE_TABLES } from "./schema";

const db = new Database("chat.db");
db.exec(CREATE_TABLES);  // runs on startup, creates tables if missing

export default db;