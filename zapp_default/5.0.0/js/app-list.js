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
let oList = document.getElementById("oList");
let downArrowDiv = document.getElementById("downArrowDiv");
oList.addEventListener("scroll", hideDownArrow);

var moreAboutContainer = document.getElementById('moreAboutContainer');
var url;
var requestType;

function closeMoreAboutPopup(event) {
	var key = event.keyCode;
	if (key !== undefined && key !== 13) {
		if(key == 9){
			document.getElementById("moreAboutLogoFocus").focus();
		}
		return false;
	}
	moreAboutContainer.style.display = "none";
	parent.closeAppListPopup();
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

function closeAppListAndOpenApp() {
	parent.openIOSApp(this);
	closeMoreAboutPopup(this);
}

function convertToArray(list) {
	var arr = [];
	for (index in list) {
		arr.push(list[index]);
	}
	return arr;
}

function filterAppList(requestType, arr) {
	if (requestType == 'RequestToLink' || requestType == 'RequestToLinkAndPay') {
		arr = arr.filter(item => item.apiVersion >= 4);
	}
	return arr;
}

function sortAppList(appList) {
	return appList.sort(function(a, b) {
			return a.appName.localeCompare(b.appName);
		});
}

function isOverflow(element) {
  return element.scrollHeight > element.clientHeight;
}

function hideDownArrow() {
	  downArrowDiv.style.display = "none";
	  oList.removeEventListener("scroll", hideDownArrow);
}

url = getQueryParams()["url"];
requestType = getQueryParams()["requestType"];

document.getElementById("closeMoreAboutContainer").addEventListener("click", closeMoreAboutPopup);
document.getElementById("closeMoreAboutContainer").addEventListener("keydown", closeMoreAboutPopup);

window.onload = function() {
	setTimeout(function(){
		document.getElementById("moreAboutLogoFocus").focus();
	},100);
	parent.readAppManifestFile(url);
	setTimeout(function() {
		var appList = convertToArray(parent.getAppList(false));
		appList = filterAppList(requestType, appList);
		appList = sortAppList(appList);
		for (index in appList) {
			var app = appList[index];
			var li = document.createElement('li');
			var bankLogoDiv = document.createElement('div');
			var bankNameDiv = document.createElement('div');
			var arrowDiv = document.createElement('div');
			
			var bankLogo = document.createElement('img');
			var arrow = document.createElement('img');
			
			li.className = "bankApp";
			bankLogoDiv.className = 'bankLogoDiv';
			bankNameDiv.className = 'bankNameDiv';
			arrowDiv.className = 'arrowDiv';
			bankLogo.className = 'bankAppImg';
			arrow.className = 'arrowImg';
			
			li.appURLScheme = app.appURLScheme;
			
			bankNameDiv.innerText = app.appName;
					
			bankLogo.src = app.appIconURL;
			
			arrow.src = '../images/app-list-popup/arrow.png';
			
			
			bankLogoDiv.appendChild(bankLogo);
			arrowDiv.appendChild(arrow);
			li.appendChild(bankLogoDiv);
			li.appendChild(bankNameDiv);
			li.appendChild(arrowDiv);
			oList.appendChild(li);
			li.addEventListener("click", closeAppListAndOpenApp);
		}
		
		if (isOverflow(oList)) {
			downArrowDiv.style.display = 'inline-block';
		}
		
	}, 300);
	
}