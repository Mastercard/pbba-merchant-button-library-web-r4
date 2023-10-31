/**  Copyright (c) 2020 Mastercard
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 
*/

var moreAboutContainer = document.getElementById('moreAboutContainer');
var url;

function closeMoreAboutPopup(event) {
	var key = event.keyCode;
	if (key !== undefined && key !== 13) {
		if(key == 9){
			document.getElementById("moreAboutLogoFocus").focus();
		}
		return false;
	}
	moreAboutContainer.style.display = "none";
	sendEvent('com.zapp.more.about.popup.close', window.id, []);
}

function sendEvent(type, id, data) {
	var postData = {
		id : window.id,
		eventType : type,
		data : data
	};
	window.parent.postMessage(JSON.stringify(postData), '*');
}

function getQueryParams() {
	var qParams = location.search.substring(1).split('&');
	var vars = {};
	var hash = [];
	for (var i = 0; i < qParams.length; i++) {
		hash = qParams[i].split('=');
		vars[hash[0]] = hash[1];
	}
	return vars;
}

url = getQueryParams()["url"];

cfiLogosLength = function (cfiLogos) {
	length = 0;
	for (var object in cfiLogos) {
	length++;
	}
	return length;
}

document.getElementById("closeMoreAboutContainer").addEventListener("click", closeMoreAboutPopup);
document.getElementById("closeMoreAboutContainer").addEventListener("keydown", closeMoreAboutPopup);

window.onload = function() {
	setTimeout(function(){
		document.getElementById("moreAboutLogoFocus").focus();
	},100);
	var cfiLogosArray = [], count=1;
	readJSONFile(url);
	setTimeout(function() {
		cfiLogos = getCfiLogosLong(true);
		var length = cfiLogosLength(cfiLogos);
		if (length > 8) {
			length = 8;
		}
		for (cfiName in cfiLogos) {
			var img = document.createElement('img');
			cfiLogosArray.push(count);
			img.alt = cfiName;
			img.id = count;
			img.setAttribute('role', 'img');
			img.setAttribute('class', 'cfiLogo');
			img.setAttribute('src', cfiLogos[cfiName]);
			document.getElementById('cfiLogos').appendChild(img);
			count++;
			
		}
		if(length > 0) {
			document.getElementById('cfiLogos').setAttribute('aria-labelledby',cfiLogosArray.join(" "));
			document.getElementById("moreAboutLogoFocus").focus();
			document.getElementById("cfiLogoContainer").style.display = "block";
		} else {
			document.getElementById("cfiLogoContainer").style.display = "none";
		}
		
	}, 100);
	
}