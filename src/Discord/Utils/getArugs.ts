import { SlashCommandBuilder,GuildMemberRoleManager } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';

/**
 * interaction에서 argument를 추출해 Map형식으로 반환함.
 * @param interaction 
 * @returns 
 */
export const getDiscordArgus = (interaction:ChatInputCommandInteraction<CacheType>) => {
    const argu = interaction.options.data
    const ret = new Map()
    for(const a of argu) {
        ret.set(a.name,a.value)
    }
    return ret;
}