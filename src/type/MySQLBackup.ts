import { Logger } from "../utils/Logger";
import mysqldump from 'mysqldump';
import { IConfig } from "config";

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
        await mysqldump({
            connection: {
                host: config.get("mysql.host"),
                user: config.get("mysql.username"),
                password: config.get("mysql.password"),
                database: this.database
            },
            dumpToFile: './backups/' + this.key + '.sql.tar',
            compressFile: true
        });
        this.log.verbose("Database backup completed for [" + this.key + "].");
    }
}
