import { client } from "./client"
import config from "./config.json" 
const { prefix } = config
//const  {prefix}  = require("./config.json")
//const  {token} = require( "./.token.json" )

import { ServerQueue } from "./ServerQueue";
import { getArgs } from "./utils"

client.on("messageCreate", function(message) {
        if (message.author.bot || !message.content.startsWith(prefix))
            return;

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        const permissions = voiceChannel.permissionsFor(message.guild.members.me);
        if (!permissions.has("Connect") || !permissions.has("Speak")) {
            return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
            );
        }

        const args = getArgs(message);
        const action = args[0].substring(prefix.length);
        const sq = ServerQueue.getServerQueue(message.guildId);
        if (sq) {
            if (sq[action]) {
                sq[action](message);
            } else {
                message.channel.send(`**${action}** n'est pas reconnu comme commande`);
            }
        } else if (action == "play") {
            new ServerQueue({ message });
        } else {
            message.channel.send(`Utiliser **play** pour lancer le bot`);
        }
    });
