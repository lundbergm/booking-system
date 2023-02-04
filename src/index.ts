import { createTerminus } from '@godaddy/terminus';

import config from './app/config';
import App from './app/app';

async function main() {
    const app = new App(config);

    const server = await app.start();

    createTerminus(server, {
        healthChecks: {
            '/health': () => {
                return Promise.resolve();
            },
        },
        signals: ['SIGINT', 'SIGTERM'],
        onSignal: () => {
            console.info('cleanup started...');
            return app.close();
        },
        onShutdown: async () => {
            console.info('cleanup finished, server is shutting down...');
        },
    });
}

main().catch((err) => {
    console.error(`app error: ${err}`, {
        stack: err instanceof Error ? err.stack : undefined,
        error: err,
    });
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.error(`uncaught exception: ${err} ${origin}`, { stack: err.stack, error: err, origin });
});
