import { SlashCommandBuilder,GuildMemberRoleManager } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
import { getDiscordAdminRoleId } from '../../model/adminRole';
/**
 * interaction을 검사하여 이 명령을 보낸 사람이 카지노의 관리자 권한을 가지고 있는지 확인합니다.
 * @param interaction 
 * @returns 관리자라면 True, 아니라면 False를 반환합니다. False의 경우, 유저에게 행해지는 조치는 모두 취해진 상태입니다.
 */
export const checkAdmin = async (interaction:ChatInputCommandInteraction<CacheType>)=>{
    const administer = interaction.member?.roles;
    const admin_id = await getDiscordAdminRoleId(interaction.guildId??'');
    if(administer instanceof GuildMemberRoleManager ) {
        const j  = administer.cache.find(r=>r.id==admin_id)
        if(!j){
            await interaction.reply({ content: '관리자가 아닙니다. 이 명령은 관리자만 가능합니다.', ephemeral: true });
            return false;
            }
    } else {
        const j = administer?.find(r=>r==admin_id)
        if(!j){
            await interaction.reply({ content: '관리자가 아닙니다. 이 명령은 관리자만 가능합니다.', ephemeral: true });
            return false;
        }
    }
    return true;
}