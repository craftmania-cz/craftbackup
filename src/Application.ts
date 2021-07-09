import { Logger } from "./utils/Logger";
import BackupManager from "./managers/BackupManager";
import FTPCleanManager from "./managers/FTPCleanManager";

const log = Logger('app:application');

export default class Application {

    private backupManager = new BackupManager();
    private ftpCleanUpManager = new FTPCleanManager();

    public async start() {
        log.info("Startup main app thread.");
        await this.backupManager.loadBackups();
        await this.ftpCleanUpManager.loadFtpCleanUpTasks();

    }

    public async stop() {

    }

    public async close() {

    }
}
