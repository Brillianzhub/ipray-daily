import { hymnsDb } from '@/lib/hymnDb';
import { fetchHymnsFromApi } from '@/lib/api/hymnsApi';
import { execSync } from '@/src/db/initHymnsDb';

export async function syncHymnsToLocalDb() {
    try {
        const remoteHymns = await fetchHymnsFromApi();

        for (const hymn of remoteHymns) {
            const { id, title, author, year, has_chorus, chorus, stanzas } = hymn;

            // Check if hymn already exists
            const check = hymnsDb.getFirstSync<{ count: number }>(
                'SELECT COUNT(*) as count FROM hymns WHERE id = ?',
                [id.toString()]
            );

            if (check?.count === 0) {
                // ✅ Use helper here
                execSync(
                    `INSERT INTO hymns (id, title, author, year, favorite, has_chorus, chorus)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id.toString(),
                        title,
                        author ?? '',
                        year ?? null,
                        0,
                        has_chorus ? 1 : 0,
                        chorus ?? '',
                    ]
                );

                for (const stanza of stanzas) {
                    execSync(
                        `INSERT INTO stanzas (hymn_id, stanza_number, text)
             VALUES (?, ?, ?)`,
                        [id.toString(), stanza.stanza_number, stanza.text]
                    );
                }
            }
        }

        console.log(`✅ Synced ${remoteHymns.length} hymns to local DB`);
    } catch (error) {
        console.error('❌ Failed to sync hymns to local DB:', error);
    }
}
