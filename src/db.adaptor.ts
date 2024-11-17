import { Pool } from 'pg';

class DbAdaptor {
    private static instance: DbAdaptor;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    public static getInstance(): DbAdaptor {
        if (!DbAdaptor.instance) {
            DbAdaptor.instance = new DbAdaptor();
        }
        return DbAdaptor.instance;
    }

    public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
        try {
            const result = await this.pool.query(sql, params);
            return result.rows;
        } catch (error: any) {
            console.error("Database query error:", error.message);
            throw new Error('Database query failed');
        }
    }
}

export default DbAdaptor;