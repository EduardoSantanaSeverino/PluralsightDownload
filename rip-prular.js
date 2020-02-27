var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
//-------------------------------------------------------

function init(){

	var timeout_duration = 5000;
	var fileName = "ThisCourse.json";
	var begin_from_video = 0;


	var vids_array = {};
	var model = {};
	var i = begin_from_video;
	var li_list = {};


function safeName(str){ return str.replace( /[:()[\]"/\\?]/ig ," "); }



	function extract_video_data(){
			var li_selected = $('.table-of-contents .module.is-current-module button.content-item.is-current');
			var video_src = $('video').first().attr('src');
			var video_name = li_selected.find('h3 span').text();
			var video_duration = li_selected.find('div.content-item-duration').text();
			var module_name = $('.table-of-contents .module.is-current-module .module-header .module-header__title').text();
			model = {
				count: i,
				name: safeName(video_name),
				module_name: safeName(module_name),
				duration: video_duration,
				vid: video_src
			}
			return model;
	}

	function save_the_vid(){
		let model = extract_video_data();
		if(!vids_array[model.module_name]) vids_array[model.module_name] = [];
		vids_array[model.module_name].push(model);
		i++;
		if(i<li_list.length){
			li_list.get(i).click();
			setTimeout(function(){save_the_vid()}, timeout_duration);
		}else{
			var course_title = $("#course-title>a").first().text();
			var videos_obj = { "course_title":course_title, "vids": vids_array };
			download_file(videos_obj, fileName, 'json');
		}
	}

	var download_file = function(data, filename, data_type='json'){
	    if(data_type=='json') data = JSON.stringify(data, undefined, 4);
	    var blob = new Blob([data], {type: 'text/'+data_type}),
	        e    = document.createEvent('MouseEvents'),
	        a    = document.createElement('a')
	    a.download = filename
	    a.href = window.URL.createObjectURL(blob)
	    a.dataset.downloadurl =  ['text/'+data_type, a.download, a.href].join(':')
	    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	    a.dispatchEvent(e)
	 }


	function download_playlist(){
		$('.table-of-contents .module:not(.is-current-module) .module-header').click(); //open all taps
		var title = $(".course-title a").first().text();
		var safe_title = title.replace(/.[\:\?\\\/\.\'"]/ig,' ');
		var playList = '<html><head><link rel="stylesheet" type="text/css" href="http://ahmed-badawy.com/MyCurrentCourses/assets/v2.1/style.css"></head><body>\n';
		playList += `<h1 id='main_title'>${safe_title}</h1>`;
		playList += $(".table-of-contents").html();
		playList += '\n<script type="text/javascript" src="http://ahmed-badawy.com/MyCurrentCourses/assets/v2.1/script.js"></script></body>';
		download_file(playList, safe_title+'.html', "html");
	}
	function begin_downloading_videos(){
		setTimeout(_=>{ 
				li_list = $(".table-of-contents .module button.content-item"); 
				setTimeout(function(){save_the_vid();}, timeout_duration) 
		},timeout_duration);
		// li_list.get(begin_from_video).click();
		// console.log(vids_array);
	}

	download_playlist();
	begin_downloading_videos();

}

setTimeout( _=>init() ,3000);
