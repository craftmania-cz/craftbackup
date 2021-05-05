import { Logger } from "./utils/Logger";

const log = Logger('app:application');

export default class Application {

    public start() {
        log.info("Startup main app thread.");
    }

    public async stop() {

    }

    public async close() {

    }
}