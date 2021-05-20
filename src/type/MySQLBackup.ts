import { Logger } from "../utils/Logger";
import mysqldump from 'mysqldump';
import { IConfig } from "config";

import * as ftp from "basic-ftp";
import * as dayjs from "dayjs";
import * as fse from "fs-extra";

const config: IConfig = require("config");

export default class MySQLBackup {

    private readonly log: any;
    private readonly database: string;
    private readonly key: string

    constructor(key: string, database: string) {
        this.log = Logger("mysql-backup:" + database);
        this.database = database;
        this.key = key;
    }

    public async run() {
        this.log.verbose("Start backup for [" + this.key + "].");
        const fileName = this.key + '_' + dayjs().format('YYYY-MM-DD_HH:mm:ss') + '.sql.tar';
        try {
            await mysqldump({
                connection: {
                    host: config.get("mysql.host"),
                    user: config.get("mysql.username"),
                    password: config.get("mysql.password"),
                    database: this.database
                },
                dumpToFile: './backups/' + fileName,
                compressFile: true
            });
        } catch (exception: any) {
            console.error(exception);
            this.log.error("Database backup failed.");
            return;
        }
        this.log.verbose("Database backup completed.");
        this.log.verbose("Starting FTP upload to host.");
        const client = new ftp.Client();
        try {
            await client.access({
                host: config.get("ftp.host"),
                user: config.get("ftp.username"),
                password: config.get("ftp.password"),
                secure: true
            });
            await client.ensureDir("/mysql");
            await client.uploadFrom('./backups/' + fileName, fileName);
        } catch (exception: any) {
            console.error(exception);
            this.log.error("FTP backup failed.");
            return;
        }
        this.log.verbose("Backup has been successfully uploaded.");
        await fse.remove('./backups/' + fileName);
        this.log.verbose("Backup successfully completed.");
    }
}
