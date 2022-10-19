/**
 * Dexie.js is a wrapper library for indexedDB,
 * for more detail, see: https://github.com/dexie/Dexie.js
 */

import type { DB } from "~/models/types";
import Dexie from "dexie";

const db = new Dexie("test") as DB;

db.version(1).stores({
  pdf: `id, name`,
  signature: `id, name`,
});

export default db;
