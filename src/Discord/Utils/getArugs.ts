import { SlashCommandBuilder,GuildMemberRoleManager } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';

export const getDiscordArgus = (interaction:ChatInputCommandInteraction<CacheType>) => {
    const argu = interaction.options.data
    const id = new Map()
    argu.forEach(i => id.set(i.name,i.value))
    return id;
}