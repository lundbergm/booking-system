import { Database } from 'sqlite3';

export class SqliteClient {
    constructor(private db: Database) {}

    public async initialize(): Promise<void> {
        /**
         * Enable foreign key support
         */
        return this.get('PRAGMA foreign_keys = ON', []);
    }

    public async run(sql: string, params: unknown[]): Promise<{ lastID: number; changes: number }> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });
    }

    public async get<T>(query: string, params: unknown[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, function (err: Error | null, row: T) {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    public async all<T>(query: string, params: unknown[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, function (err: Error | null, rows: T[]) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
}
