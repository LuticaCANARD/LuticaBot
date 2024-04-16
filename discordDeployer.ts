/**
 * Command : function 의 Key-value 
 */
import path from 'node:path';

export const executeCommand = () =>{
    var os =require("os");
    const { REST, Routes } = require('discord.js');
    const fs = require('node:fs');

    let clientId='';
    let guildId ='';


    clientId = process.env.CLIENT_ID ?? '';
    guildId = process.env.TO_REGISTER_GUILD ?? '';
    let casinoguildId = process.env.TO_REGISTER_GUILD_CASINO;
    const token = process.env.DISCORD_BOT_TOKEN;



    const getNormalCommands = () =>{
        const path_d = path.join(__dirname, './Discord/command/normal');
        const commands = [];
        // Grab all the command files from the commands directory you created earlier
        const commandFiles = fs.readdirSync(path_d).filter((file:string) => file.endsWith('.ts'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const command = require(path.join(path_d,`/${file}`));
            if(command.__esModule) commands.push(command.default.data.toJSON())
            else commands.push(command.data.toJSON());
        }
        return commands;
    }

    
    

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(token);

    // and deploy your commands!
    (async () => {
        try {
            const normal_coms = getNormalCommands();
            console.log(`Started refreshing ${normal_coms.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set

            const rest = new REST({ version: '9' }).setToken(token);
            // const killer = await rest.get(Routes.applicationGuildCommands(clientId, guildId))

            // const urls = killer.map(data => `${Routes.applicationGuildCommands(clientId, guildId)}/${data.id}`)
            // const v = urls.map( u=>rest.delete(u));
            //for(const p of v) await p;
            //console.log(normal_coms)

            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: normal_coms },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            if(casinoguildId) {
                const path_casino = path.join(__dirname, './Discord/command/Casino');
                const CasinoCommand = getNormalCommands();
                const CasinoCommandFiles = fs.readdirSync(path_casino).filter((file:string) => file.endsWith('.ts'));

                for (const file of CasinoCommandFiles) {
                    const command = require(path.join(path_casino,`/${file}`));
                    if(command.__esModule) CasinoCommand.push(command.default.data.toJSON())
                    else CasinoCommand.push(command.data.toJSON());
                }
                console.log('Casino commands...');

                const data2 = await rest.put(
                    Routes.applicationGuildCommands(clientId, casinoguildId),
                    { body: CasinoCommand },
                );
                console.log(`Successfully reloaded ${data2.length} application (/) commands.`);
            }

        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}
