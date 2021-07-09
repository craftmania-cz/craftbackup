import { Logger } from "../utils/Logger";
import * as dayjs from "dayjs";
import * as ftp from "basic-ftp";
import { IConfig } from "config";
import { FileInfo } from "basic-ftp";
import { MessageBuilder } from "discord-webhook-node";
import { convertMsToTime } from "../utils/TimeUtils";
import DiscordWebhook from "../utils/DiscordWebhook";
const config: IConfig = require("config");

class FTPCleanUp {

    private readonly log: any;
    private readonly key: string;
    private readonly remoteDir: string;
    private readonly oldInHours: number;

    constructor(key: string, remoteDir: string, oldInHours: number) {
        this.log = Logger("ftp-cleanup:" + key);
        this.key = key;
        this.remoteDir = remoteDir;
        this.oldInHours = oldInHours;
    }

    public async run() {
        this.log.verbose("Start cleanup for [" + this.key + "].");
        const startTime = dayjs();
        const client = new ftp.Client();
        let filesToDelete = [];
        try {
            await client.access({
                host: config.get("ftp.host"),
                user: config.get("ftp.username"),
                password: config.get("ftp.password"),
                secure: true
            });
            await client.ensureDir(this.remoteDir); // Exists?
            //await client.cd(this.remoteDir);
            const fileList: FileInfo[] = await client.list();
            for (const file of fileList) {
                if (dayjs(startTime).diff(file.rawModifiedAt, "hours") >= this.oldInHours) {
                    filesToDelete.push(file.name);
                    await client.remove('' + file.name, true);
                    this.log.verbose("File " + file.name + " has been successfully deleted.");
                }
            }
            await client.close();
            const finalProcessedTime = dayjs().diff(startTime, 'ms');

            // Send discord info only, when some files has been deleted.
            if (filesToDelete.length >= 1) {
                const discordInfo = new MessageBuilder();
                discordInfo.setTitle("File cleanup completed");
                discordInfo.addField("Task ID:", this.key, true);
                discordInfo.addField("Completed in: ", convertMsToTime(finalProcessedTime), true);
                discordInfo.addField("Removed files: ", String(filesToDelete.length), true);
                discordInfo.addField("List of files:", filesToDelete.map(value => { return '`' + value + '`\n' }).toString(), false);
                discordInfo.setColor(13474304);
                await DiscordWebhook.getHook().send(discordInfo);
                this.log.verbose("Discord info successfully sent.");
                this.log.verbose("File Cleanup completed.");
            }
        } catch (exception) {
            console.error(exception);
            this.log.error("FTP Cleanup failed.");
            return;
        }

        this.log.verbose("FTP CleanUp successfully completed.");
    }
}

export default FTPCleanUp;
