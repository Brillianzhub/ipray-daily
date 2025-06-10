import { hymnsDb } from '@/lib/hymnDb';
import { ensureHymnsDbDir } from '@/lib/hymnDb';


export function execSync(sql: string, args: any[] = []): void {
  (hymnsDb as any).exec([{ sql, args }], false, (error: any) => {
    if (error) {
      console.error('SQL Exec Error:', error);
      throw error;
    }
  });
}




export async function initHymnsDb() {
  try {
    await ensureHymnsDbDir();

    hymnsDb.execSync(`
      CREATE TABLE IF NOT EXISTS hymns (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        author TEXT,
        year INTEGER,
        favorite INTEGER,
        has_chorus INTEGER,
        chorus TEXT
      );
    `);

    hymnsDb.execSync(`
      CREATE TABLE IF NOT EXISTS stanzas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hymn_id TEXT NOT NULL,
        stanza_number INTEGER,
        text TEXT,
        FOREIGN KEY (hymn_id) REFERENCES hymns (id)
      );
    `);

    // console.log('✅ Hymns DB initialized with execSync');
  } catch (err) {
    console.error('❌ Failed to initialize hymns DB:', err);
  }
}

