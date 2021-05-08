
import * as fs from "fs";
import { Logger } from "../utils/Logger";
import * as cron from "node-cron"
import MySQLBackup from "../type/MySQLBackup";

interface MySQLObject {
    backups: MySQLDetail[];
}

interface MySQLDetail {
    key: string;
    database: string;
    cron: string;
}

const log = Logger('backup:manager');

export default class BackupManager {

    public mysqlCronArray: MySQLDetail[] = [];

    public async loadBackups() {
        log.info("Start loading backups into cache.");
        await this.loadMySQLBackups();
        await this.loadCronTasks();
        log.info("All backups successfully loaded and started.");
    }

    private async loadMySQLBackups() {
        try {
            let file = fs.readFileSync('./config/backup-mysql.json', 'utf8');
            let data = JSON.parse(file);

            if (data === null || data === undefined) {
                return;
            }

            const databaseList = data as unknown as MySQLObject;
            for (let database of databaseList.backups) {
                this.mysqlCronArray.push(database);
                log.info("Database details for: " + database.database + " [" + database.key + "] loaded.");
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async loadCronTasks() {
        this.mysqlCronArray.forEach((mysqlDetail: MySQLDetail) => {
            if (cron.validate(mysqlDetail.cron)) {
                cron.schedule(mysqlDetail.cron, () => {
                    new MySQLBackup(mysqlDetail.key, mysqlDetail.database).run();
                });
            } else {
                log.warn("Cron configuration for - " + mysqlDetail.key + " is invalid.");
            }
        })
    }

}
