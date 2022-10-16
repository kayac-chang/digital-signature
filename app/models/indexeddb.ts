/**
 * Dexie.js is a wrapper library for indexedDB,
 * for more detail, see: https://github.com/dexie/Dexie.js
 */

import type { DB } from "~/models/types";
import Dexie from "dexie";

export default new Dexie("test") as DB;
