const { joinVoiceChannel } = require('@discordjs/voice');

const connection = joinVoiceChannel({
	channelId: channel.id,
	guildId: channel.guild.id,
	adapterCreator: channel.guild.voiceAdapterCreator,
});
const { getVoiceConnection } = require('@discordjs/voice');

const connection2 = getVoiceConnection(myVoiceChannel.guild.id);
connection.destroy()

// Subscribe the connection to the audio player (will play audio on the voice connection)
const subscription = connection.subscribe(audioPlayer);

// subscription could be undefined if the connection is destroyed!
if (subscription) {
	// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
	setTimeout(() => subscription.unsubscribe(), 5_000);
}

const { VoiceConnectionStatus } = require('@discordjs/voice');

connection.on(VoiceConnectionStatus.Ready, () => {
	console.log('The connection has entered the Ready state - ready to play audio!');
});

const { VoiceConnectionStatus, entersState } = require('@discordjs/voice');

connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
	try {
		await Promise.race([
			entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
			entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
		]);
		// Seems to be reconnecting to a new channel - ignore disconnect
	} catch (error) {
		// Seems to be a real disconnect which SHOULDN'T be recovered from
		connection.destroy();
	}
});

const { createAudioPlayer } = require('@discordjs/voice');

const player = createAudioPlayer();
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

const player2 = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
player.stop();
const resource = createAudioResource('/home/user/voice/track.mp3');
player.play(resource);

// Play "track.mp3" across two voice connections
connection.subscribe(player);
connection2.subscribe(player);

player.pause();

// Unpause after 5 seconds
setTimeout(() => player.unpause(), 5_000);

const { AudioPlayerStatus } = require('@discordjs/voice');

player.on(AudioPlayerStatus.Playing, () => {
	console.log('The audio player has started playing!');
});

const { createAudioResource } = require('@discordjs/voice');

const resource2 = createAudioResource('/home/user/voice/music.mp3', {
	metadata: {
		title: 'A good song!',
	},
});

player.play(resource);

player.on('error', error => {
	console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
	player.play(getNextResource());
});

const { createAudioResource } = require('@discordjs/voice');

const resource3 = createAudioResource('/home/user/voice/music.mp3', {
	metadata: {
		title: 'A good song!',
	},
});

player.play(resource);

player.on('error', error => {
	console.error(error);
});

player.on(AudioPlayerStatus.Idle, () => {
	player.play(getNextResource());
});


const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { createAudioResource, StreamType } = require('@discordjs/voice');

// Basic, default options are:
// Input type is unknown, so will use FFmpeg to convert to Opus under-the-hood
// Inline volume is opt-in to improve performance
let resource = createAudioResource(join(__dirname, 'file.mp3'));

// Will use FFmpeg with volume control enabled
resource = createAudioResource(join(__dirname, 'file.mp3'), { inlineVolume: true });
resource.volume.setVolume(0.5);

// Will play .ogg or .webm Opus files without FFmpeg for better performance
// Remember, inline volume is still disabled
resource = createAudioResource(createReadStream(join(__dirname, 'file.ogg'), {
	inputType: StreamType.OggOpus,
}));

// Will play with FFmpeg due to inline volume being enabled.
resource = createAudioResource(createReadStream(join(__dirname, 'file.webm'), {
	inputType: StreamType.WebmOpus,
	inlineVolume: true,
}));

player.play(resource);

