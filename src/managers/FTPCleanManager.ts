import * as fs from "fs";
import { Logger } from "../utils/Logger";
import * as cron from "node-cron";
import FTPCleanUp from "../type/FTPCleanUp";

const log = Logger('ftp:clean_manager');

interface FTPCleanConfigObject {
    tasks: FTPCleanTask[];
}

interface FTPCleanTask {
    key: string;
    remoteDir: string;
    oldInHours: number;
    cron: string;
}

class FTPCleanManager {

    public ftpCleanUpCronArray: FTPCleanTask[] = [];

    public async loadFtpCleanUpTasks(): Promise<void> {
        log.info("Start loading ftp cleanup tasks into cache.");
        await this.loadFtpConfigTasks();
        await this.startCronTasks();
        log.info("All ftp cleanup tasks successfully loaded.");
    }

    private async loadFtpConfigTasks(): Promise<void> {
        try {
            let file = fs.readFileSync('./config/ftp-clean-tasks.json', 'utf8');
            let data = JSON.parse(file);
            if (data === null || data === undefined) {
                return;
            }
            const taskList: FTPCleanConfigObject = data as unknown as FTPCleanConfigObject;
            for (const cleanTask of taskList.tasks) {
                this.ftpCleanUpCronArray.push(cleanTask);
                log.info("FTP Clean task: " + cleanTask.key + " loaded.");
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async startCronTasks() {
        this.ftpCleanUpCronArray.forEach((task: FTPCleanTask) => {
            if (cron.validate(task.cron)) {
                cron.schedule(task.cron, () => {
                    new FTPCleanUp(task.key, task.remoteDir, task.oldInHours).run();
                });
            } else {
                log.warn("Cron configuration for - " + task.key + " is invalid.");
            }
        })
    }
}

export default FTPCleanManager;
