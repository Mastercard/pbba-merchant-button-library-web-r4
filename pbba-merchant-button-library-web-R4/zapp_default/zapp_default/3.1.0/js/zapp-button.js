/*******************************************************************************
 * Copyright 2016 IPCO 2012 Limited
 * 
 * Licensed under the Apache License, Version 2.0 (the "License "); you may not
 * use this file except in compliance with the License . You may obtain a copy
 * of the License at
 * 
 * http: // www.apache.org /licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS " BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied . See the
 * License for the specific language governing permissions and limitations under
 * the License .
 ******************************************************************************/

var pbbaHrefLink;
var mainContainer;
var buttonHeight;
var buttonWidth;
var pbbaLogoHeight;
var cfiLogos = [];
var style = [];
var bankUrl;
var pbbaLogoContainer;
var cfiLogosContainer;
var pbbaLogo;
var loadedLogoClass;
var cfiLogosContainerMarginLeft;
var cfiLogoDivMarginRight;
var cfiLogoHeightAndWidth; 
var pbbaLogoWidth;
var pbbaLogoHeight;
var pbbaButtonBorderRadius;

var longLogoSrc = "../images/pbba-long.png";
var shortLogoSrc = "../images/pbba-short.png";
var miniLogoSrc = "../images/pbba-mini.png";

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

window.onresize = function(event) {
	var i = 0, cfiLogoDivList;
	cfiLogoDivList = document.getElementById("cfiLogosContainer");
	for (cfiName in cfiLogos) {
		cfiLogoDivList.removeChild(cfiLogoDivList.childNodes[0]);
	i++;
	}
	
	// Logic to rotate the screen
	pbbaLogoContainer = document.getElementById("pbbaLogoContainer");
	pbbaLogoContainer.classList.remove("long", "short", "mini");
	
	// Set height and width of button
	buttonHeight = mainContainer.offsetHeight;
	buttonWidth = mainContainer.offsetWidth;
	

	renderPBBAButton();
}

zapp.bindEvent("message", function(ev) {

	try {
		data = JSON.parse(ev.data);
		pbbaHrefLink = document.getElementById('payByBankApp');
	} catch (err) {
		return;
	}

	if (typeof data.eventType === "undefined"
			|| data.eventType.indexOf("com.zapp.button") == -1)
		return;

	switch (data.eventType) {
	case "com.zapp.button.stop": {
		if (pbbaHrefLink.getAttribute("class") == null)
			break;
		pbbaHrefLink.setAttribute("class", pbbaHrefLink.getAttribute("class").replace(" loading", ""));
		break;
	}
	case "com.zapp.button.disable": {
		pbbaHrefLink.style.opacity = 0.2;
		break;
	}
	case "com.zapp.button.enable": {
		pbbaHrefLink.style.opacity = 1.0;
		break;
	}
	default: {
	}
	}
});

zapp.documentReady(function() {

	pbbaHrefLink = document.getElementById('payByBankApp');
	mainContainer = document.getElementById('mainContainer');
	pbbaLogoContainer = document.getElementById("pbbaLogoContainer");
	cfiLogosContainer = document.getElementById("cfiLogosContainer");
				
	bankUrl = getQueryParams()["url"];
	buttonHeight = mainContainer.offsetHeight;
	buttonWidth = mainContainer.offsetWidth;
	pbbaButtonBorderRadius = buttonHeight/7; // Pbba Button's border-radius is calculated on the basis of button's height, since button height is dynamic. 
	pbbaHrefLink.style.borderRadius =  pbbaButtonBorderRadius+ 'px';

	pbbaHrefLink.onclick = function() {pbbaLinkClick()};
	pbbaHrefLink.onkeypress = function() {pbbaLinkClick()};
	function pbbaLinkClick(){
		if (pbbaHrefLink.getAttribute("class").indexOf("loading") == -1) {
			pbbaHrefLink.setAttribute("class", pbbaHrefLink.getAttribute("class") + " loading");
		}
		
		window.parent.postMessage("read-pbba-cookies", "*");
		
		var postData = {
			iframeID : zapppopup.getParameterByName('id'),
			id : zapppopup.getParameterByName('id'),
			pcid : zapppopup.getCookie('pcid'),
			hasApp : zapppopup.getCookie('hasApp'),
			eventType : 'com.zapp.button.click'
		};
		window.parent.postMessage(JSON.stringify(postData), '*');
	};

	getCFILogosAndRenderPBBAButton();
	
});

function cfiLogosLength(cfiLogos) {
	length = 0;
	for ( var object in cfiLogos) {
		length++;
	}
	return length;
}

function getCFILogosAndRenderPBBAButton() {
	
	parent.readJSONFile(bankUrl);
	setTimeout(
			function() {
				
				cfiLogos = parent.getCfiLogosShort(true);
				
				renderPBBAButton();
			

			}, 500);

}

function renderPBBAButton(){
	pbbaLogo = document.getElementById("pbbaLogo");
	var noOfCFIs = cfiLogosLength(cfiLogos);
	
	// Calculate the CFI and PBBA logo's height and width based on the button's width. The value to be multiplied with is derived from the wireframe. 
	cfiLogoHeightAndWidth = 0.094 * buttonWidth; // Since the CFI logo is a square, height and width are the same
	cfiLogoBorderRadius = 0.022 * buttonWidth; // CFI logo's border radius varies on small and large devices
	pbbaLogoHeight = .5 * buttonHeight; // PBBA logo's height remains the same despite the number of logos as per the wireframe
	
	

	 if (noOfCFIs <= 4) {
		loadedLogoClass = "long";
		pbbaLogoContainer.className += " " + loadedLogoClass;
		pbbaLogo.src = longLogoSrc;
		pbbaLogoWidth = .47 * buttonWidth;
		cfiLogoDivMarginRight = .02 * (noOfCFIs * cfiLogoHeightAndWidth);
	} else if (noOfCFIs <= 6 ) {
		loadedLogoClass = "short";
		pbbaLogoContainer.className += " " + loadedLogoClass;
		pbbaLogo.src = shortLogoSrc;
		pbbaLogoWidth = .23 * buttonWidth;
		cfiLogoDivMarginRight = .02 * (noOfCFIs * cfiLogoHeightAndWidth);
	} else if (noOfCFIs >= 7 ) {
		loadedLogoClass = "mini";
		pbbaLogoContainer.className += " " + loadedLogoClass;
		pbbaLogo.src = miniLogoSrc;
		pbbaLogoWidth = .07 * buttonWidth;
		cfiLogoDivMarginRight = .01 * (noOfCFIs * cfiLogoHeightAndWidth);
	} 
	
	 
	 if (noOfCFIs <= 1) {
			pbbaLogoContainer.style.setProperty("line-height", buttonHeight+'px');
			pbbaLogoContainer.className += " centerAlign" ;
		} 
	// Set the PBBA logo height and width
	pbbaLogo.style.setProperty("height", 'auto');
	//pbbaLogo.style.setProperty("height", pbbaLogoHeight+'px'); // Leave this here
	pbbaLogo.style.setProperty("width", pbbaLogoWidth+'px');
	
	cfiLogosContainerMarginLeft = buttonWidth - ((noOfCFIs * cfiLogoHeightAndWidth) + (noOfCFIs * cfiLogoDivMarginRight)) - 8; // Margin left if the distance between the left button border and the cfiLogosContainer
	
	// Set the margins between the left and right button borders and the CFI logos div
	cfiLogosContainer.style.setProperty("margin-left", cfiLogosContainerMarginLeft+'px'); 
	//cfiLogosContainer.style.setProperty("margin-right", '10px'); 
	
	for (cfiName in cfiLogos) {
		

		// Create a div to host a CFI logo
		var cfiLogoDiv = document.createElement('div');
		cfiLogoDiv.className = 'cfiLogoDiv';
		
		// Create an image element. This is the CFI logo.
		var cfiLogo = document.createElement('img');
		
		// Create and render the CFI logo
		cfiLogo.src = cfiLogos[cfiName];
		cfiLogo.alt = cfiName;
		cfiLogo.style.setProperty("border", 'none');
		cfiLogo.style.width = cfiLogoHeightAndWidth+'px';
		cfiLogo.style.height = cfiLogoHeightAndWidth+'px';
		cfiLogo.style.borderRadius = cfiLogoBorderRadius+'px';
		cfiLogo.className = 'cfiLogo';
		
		// Append the CFI logo to the CFI logo div
		cfiLogoDiv.appendChild(cfiLogo);
		
		// Distance between each CFI logo div
		cfiLogoDiv.style.setProperty("padding-right", cfiLogoDivMarginRight+'px'); 
		
		
		// Append the CFI logo div to the right div
		cfiLogosContainer.appendChild(cfiLogoDiv);
		
	}
	
}