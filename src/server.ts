'use strict';
import * as debug from 'debug';
import * as fs from 'fs';
import { IConfig } from "config";
import { Logger } from "./utils/Logger";
//import { SQLManager } from "./managers/SQLManager";
import Application from "./Application";

const config: IConfig = require("config");

if (!fs.existsSync('/config/default.json') && fs.existsSync('/config/default.json.example')) {
    console.error('Zapomněl jsi změnit .default.json.example na .default.json. Ukončuji proces.');
    process.exit(1);
}

debug('ts:server');

const stage = process.env.ENVIRONMENT || config.get('app.environment') || 'development';

// Default logger
const log = Logger('app:start');

const logo = () => {
    log.info(' ');
    log.info('CraftBackup 1.0 starting...');
    log.info('');
};
logo();

log.info('MySQL connection starting...');
//SQLManager.getInstance();
log.verbose('MySQL connection completed');

const application = new Application();

const stopServer = async () => {
    console.info('Server is stopping');
    await application.stop();
    await application.close();
    console.log('Server stopped');
    process.exit(0);
};

(async function () { //TODO: Kontrola configu
    handleSignalsAndSupressUncaughtExceptions();
    await application.start();
    process.stdin.resume(); // Zastavení zastavování :o
})();


function handleSignalsAndSupressUncaughtExceptions() {
    process.on('SIGINT', stopServer);
    process.on('SIGTERM', stopServer);
    process.removeAllListeners('uncaughtException');
    process.on('uncaughtException', (error: any) => console.error(error && error.stack ? error.stack : error));
}
process.on('unhandledRejection', (error: Error) => {
    throw error;
});


