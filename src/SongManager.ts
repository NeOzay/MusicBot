import youtubedl from "youtube-dl-exec"
import sanitize from "sanitize-filename"

import {bankSongFolder} from "./config.json"

import fs from "node:fs"
import path from "node:path"

const bankPath = path.resolve(bankSongFolder)

function findFile(path:string, name:string) {
	return fs.readdirSync(path).find(function(file) {
		return file.includes(name)
	})
}

class SongManager {

	async get(url: string) {
		const urlClear = sanitize(url)
		let file = findFile(bankPath, urlClear)
		if (!file){
			console.log(`start to download video at: ${url}`);
			const reponce = await youtubedl(url, {extractAudio:true, audioFormat:"mp3", output:`bank/${urlClear}.%(ext)s`, simulate:false})
			file = findFile(bankPath, urlClear)
			if (!file) {
				console.log(`Error: can't download ${url}`)
			}
		}
		return !file ? "" : path.join(bankPath, file)
	}
}

const manager = new SongManager()

export default manager