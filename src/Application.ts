import { Logger } from "./utils/Logger";
import BackupManager from "./managers/BackupManager";

const log = Logger('app:application');

export default class Application {

    private backupManager = new BackupManager();

    public async start() {
        log.info("Startup main app thread.");
        await this.backupManager.loadBackups();
    }

    public async stop() {

    }

    public async close() {

    }
}
