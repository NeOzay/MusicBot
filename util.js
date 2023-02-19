/** @param {discord.message} message 
 *  @returns {string[]}
 */
function getArgs(message) {
	return message.content.split(/\s+/)
}

function createEmbed(message) {
	const iconURL = message ? message.author.avatarURL() :  
	const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setAuthor({ name: 'Some name', iconURL: iconURL })
		.setDescription('Some description here')
}
export { getArgs }