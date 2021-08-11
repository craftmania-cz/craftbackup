import { Logger } from "./utils/Logger";
import BackupManager from "./managers/BackupManager";
import FTPCleanManager from "./managers/FTPCleanManager";
import * as fs from "fs";

const log = Logger('app:application');

export default class Application {

    private backupManager = new BackupManager();
    private ftpCleanUpManager = new FTPCleanManager();

    public async start() {
        log.info("Startup main app thread.");

        if (!fs.existsSync("./backups")) {
            log.error("Folder for backups /backup not found.");
            process.exit(1);
        }

        if (fs.existsSync("./config/backup-mysql.json")) {
            log.info("Backup file for mysql backups found.");
            await this.backupManager.loadBackups();
        }

        if (fs.existsSync("./config/ftp-clean-tasks.json")) {
            log.info("FTP clean tasks file found.");
            await this.ftpCleanUpManager.loadFtpCleanUpTasks();
        }

        log.info("Application startup completed.");

    }

    public async stop() {

    }

    public async close() {

    }
}
