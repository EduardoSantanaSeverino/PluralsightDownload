const fs = require('fs');
const path = require('path');
const https = require('https');

let timeout = 10000;

function safeName(str){ return str.replace( /[:()[\]"/\\?]/ig ," "); }

let contents = JSON.parse(fs.readFileSync('ThisCourse.json', 'utf8'));
const courseTitle = safeName(contents.course_title);
// const courseTitle = safeName('hhello:1?2/3\'()/33:[]4damn');
const vids = contents.vids;
console.log(courseTitle);


if(!fs.existsSync(courseTitle)){ fs.mkdirSync(courseTitle); } //create course folder

let modules = Object.keys(vids);
let lastItem = getLastItem();

// let videos_url_array = {};
for(let i=0;i<modules.length;i++){
	let module_name = modules[i];
	let module_path = path.join(courseTitle,`${i+1} - `+module_name);
	if(!fs.existsSync(module_path)){ fs.mkdirSync(module_path); }//create the module folder
	for(let j=0; j<vids[module_name].length; j++){
		let video = vids[module_name][j];
		let video_path = path.join(module_path,`${video.count+1}-${j+1}-${video.name}.mp4`);
		let https_path = video.vid;
		// videos_url_array[video_path] = https_path;
		let downloadDesc = video.count + ' of ' + lastItem.count + ' - ' + video.name;
		setTimeout( _=>downloadVideo(https_path, video_path, downloadDesc), timeout*video.count);
	}
}

function downloadVideo(https_path, video_path, desc){
	console.log(desc);
	var file = fs.createWriteStream(video_path);
	var request = https.get(https_path, function(response){ response.pipe(file); })
	.on('error', (e) => { console.error(e); });
}

function getLastItem()
{
	var retVal;
	for(let i=0;i<modules.length;i++){
		let module_name = modules[i];
		let module_path = path.join(courseTitle,`${i+1} - `+module_name);
		if(!fs.existsSync(module_path)){ fs.mkdirSync(module_path); }//create the module folder
		for(let j=0; j<vids[module_name].length; j++){
			let video = vids[module_name][j];
			retVal = video;
		}
	}
	return retVal;
}

