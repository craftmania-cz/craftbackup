import { MessageBuilder, Webhook } from "discord-webhook-node";
import { IConfig } from "config";

const config: IConfig = require("config");
const hook = new Webhook(config.get("app.discord-webhook"));

const FOOTER = `CraftBackup ${process.env.npm_package_version}`

class DiscordWebhook {

    public static async simplyMessage(title: string | null = null, description: string): Promise<void> {
        const embed = new MessageBuilder()
        if (title !== null) {
            embed.setTitle(title);
        }
        embed.setDescription(description);
        embed.setFooter(FOOTER);
        embed.setColor(2057818); // #8681D3
        await hook.send(embed);
    }

    public static async warningMessage(title: string | null = null, description: string): Promise<void> {
        const embed = new MessageBuilder()
        if (title !== null) {
            embed.setTitle('Warning: ' + title);
        } else {
            embed.setTitle('Warning');
        }
        embed.setDescription(description);
        embed.setFooter(FOOTER);
        embed.setColor(16771154); // #FFE852
        await hook.send(embed);
    }

    public static async dangerMessage(title: string | null = null, description: string): Promise<void> {
        const embed = new MessageBuilder()
        if (title !== null) {
            embed.setTitle('Danger: ' + title);
        } else {
            embed.setTitle('Danger');
        }
        embed.setDescription(description);
        embed.setFooter(FOOTER);
        embed.setColor(4349166); // #EE5C42
        await hook.send(embed);
    }

    public static async fatalMessage(title: string | null = null, description: string): Promise<void> {
        const embed = new MessageBuilder()
        if (title !== null) {
            embed.setTitle('Fatal error: ' + title);
        } else {
            embed.setTitle('Fatal error');
        }
        embed.setDescription(description);
        embed.setFooter(FOOTER);
        embed.setColor(2500301); // #CD2626
        await hook.send(embed);
    }

    public static getHook(): Webhook {
        return hook;
    }
}

export default DiscordWebhook;
