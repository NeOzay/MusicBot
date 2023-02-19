import  ytdl  from "ytdl-core";
const {getInfo, getBasicInfo} = ytdl
import fs from "fs";
import { Client } from "discord.js";

import { joinVoiceChannel, createAudioResource, createAudioPlayer } from '@discordjs/voice';

import config  from "./config.json" assert {type:"json"}
import tokenjson  from "./.token.json" assert {type:"json"}
const  {prefix}  = config
const  {token}  = tokenjson
;


const player = createAudioPlayer();

const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });

client.login(token);

client.on("messageCreate", async (message) => {
	//console.log(message)
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  const args = message.content.split(/\s+/)
  //const serverQueue = queue.get(message.guildId)
  if (message.content.startsWith(`${prefix}test`)) {
    console.log((await getSongInfo(args[1])).title)
  };
  if (message.content.startsWith(`${prefix}download`)) {
      message.channel.send("download ...")
      
      //ytdl(args[1], {filter: "audioonly", format:"m4a"}).pipe(fs.createWriteStream("test.m4a"))
    };
});


async function getSongInfo(url) {
  const songInfo = await getBasicInfo(url);
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };
}
console.log(await getInfo("https://www.youtube.com/watch?v=9minv0O8rlI"))