/** @param {discord.message} message 
 *  @returns {string[]}
 */
function getArgs(message) {
	return message.content.split(/\s+/)
}

export {getArgs}