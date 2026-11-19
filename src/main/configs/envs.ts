import { app } from 'electron/main'
import { join } from 'node:path'

const DB_FILE = 'data.db'

export default {
  DB_PATH: app.isPackaged ? join(app.getPath('userData'), DB_FILE) : DB_FILE,
  CIPHER_KEY: 'B1zIn3nt0**.2026'
}
