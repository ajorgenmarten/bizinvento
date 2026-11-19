import { app } from 'electron'
import { join } from 'path'

// In dev the DB lives next to the project root (so the committed data.db is used).
// In a packaged app the cwd is "/" and the resources live inside app.asar, so the
// database must live in the writable per-user data directory.
const DB_PATH = app.isPackaged ? join(app.getPath('userData'), 'data.db') : 'data.db'

export default {
  DB_PATH,
  CIPHER_KEY: 'B1zIn3nt0**.2026'
}
