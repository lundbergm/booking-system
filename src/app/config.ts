import dotenv from 'dotenv-defaults';

dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    sqlite: {
        path: process.env.SQLITE_PATH || '../../../db.sqlite',
    },
};

export default config;
export type AppConfig = typeof config;
