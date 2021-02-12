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

var confirmDiv = document.getElementById('wrapperDiv');
var blanket = document.getElementById('blanket');
var countdownTimer = "";
var newImgSrc = null;
var imageKey = null;
var cfiLogoLength;
var closePopupFlag = false
function showBrnPop() {
	var x = document.getElementById("brnPopUp");
	var y = document.getElementById("intermediatePopUp");
	x.style.display = "block";
	y.style.display = "none";
	switchBetweenPopup('BRN');
	document.getElementById("pbbaLogoFocus").style.display = "none";
	document.getElementById("pbbaLogoFocus2").style.display = "block";
	document.getElementById("pbbaLogoFocus2").focus();
	isCfiLogo(cfiLogoLength);
	checkBrnTimeOut();
}

//This function is used for check BRN timeout if Yes to hide Step3 label or if No then display step 3 label

function checkBrnTimeOut() {
	var brnTimeOut = document.getElementById("brnExpire").getAttribute("style");
	if(brnTimeOut != null) {
		if(brnTimeOut.search("block") !== -1)
		{
		document.getElementById("step3CaptionDsk").style.display = "none";
		document.getElementById("step3CaptionMbl").style.display = "none";
		
		} else {
			document.getElementById("step3CaptionDsk").style.display = "block";
		}
	}
}

function isCfiLogo(cfiLogoLength){
	if(cfiLogoLength != undefined) {
		if(cfiLogoLength == 0) {
			document.getElementById("list-of-banks").style.display = "none";
			document.getElementById("mobileCfiLogo").style.display = "none";
			
		} else {
			if(!isMobile) {
				document.getElementById("list-of-banks").style.display = "block";
				document.getElementById("cfiLogosImgWrapper").style.display = "block";
			}
		}
	}
	
}
document.getElementById("yes").addEventListener("click", cancelPopupWindow); 
document.getElementById("yes").addEventListener("keydown", cancelPopupFocus);
document.getElementById("no").addEventListener("click", closePopupWindow);
document.getElementById("no").addEventListener("keydown", closePopupFocus);
document.getElementById("closeBRNContainer").addEventListener("click", closePopup);
document.getElementById("closeBRNContainer").addEventListener("keydown", controlFocusBrnPopup);
document.getElementById("BrnExpiredTryAgainButton").addEventListener("click", newRequest);
document.getElementById("BrnErrorTryAgainButton").addEventListener("click", newRequest);
document.getElementById("notificationGetCodeButton").addEventListener("click", showBrnPop);
document.getElementById("brnGetCodeButton").addEventListener("click", showBrnPop);
document.getElementById("openBankingAppButton").addEventListener("click", openApp);
document.getElementById("more-about").addEventListener("click", showMoreAboutPopup);

function closePopup() {
	closePopupFlag = true;
	if (typeof blanket != "undefined" && blanket != null) {
		blanket.style.height = document.getElementById('brnContainer').offsetHeight	+ "px";
		blanket.style.width = document.getElementById('brnContainer').offsetWidth + "px";
		blanket.style.display = "block";
	}
	confirmDiv.style.display = "block";
	document.getElementById("customHeadingH4").focus();
}

function platformSupportsZapp() {
	var isiOS = navigator.userAgent.match(/iPhone|iPod|iPad/);
	var isAndroid = navigator.userAgent.match(/Android/);
	return (isiOS || isAndroid) ? true : false;
}

function updateSize2() {
	try {
		window.parent.document.body.appendChild(document
				.getElementById('cover'));
		window.parent.document.getElementById('cover').style.display = "block";
	} catch (e) {

	}
}
function fnIsMobile() {
	return platformSupportsZapp();
}

function fnIsTablet() {
	return (fnIsMobile() && (navigator.userAgent.match('iPad') || !navigator.userAgent
			.match(/mobile/i)));
}

window.onresize = function(event) {
	checkResponsiveOrientation();
}

function checkResponsiveOrientation() {
	if (window.innerHeight > window.innerWidth) {
		var brnTimeOut = document.getElementById("brnExpire").getAttribute("style");
		var brnNotGenerated = document.getElementById("brnNotGenerated").getAttribute("style");
		if(brnTimeOut != null && brnTimeOut.search("block") !== -1)
			{
			document.getElementById("step3CaptionMbl").style.display = "none";
			} else if(brnNotGenerated == null || brnNotGenerated.search("none") !== -1){
				document.getElementById("step3CaptionMbl").style.display = "block";
			}
				isCfiLogo(cfiLogoLength);
		return 'Potrait';
	} else {
		document.getElementById("step3CaptionMbl").style.display = "none";
			isCfiLogo(cfiLogoLength);
		return 'Landscape';
	}
}

// This function is used for set focus on BRN expired heading once transaction timeout
function setBrnExpiredFocus(){
	var notificationPopup = document.getElementById("step3NotificationPopup").getAttribute("style");
	if(notificationPopup != null) {
		if(notificationPopup.search("block") !== -1)
		{
			document.getElementById("brnExpired").blur();
		} else {
			document.getElementById("brnExpired").focus();
		}
	} 
}


window['id'] = null;
clickedButton = null;
var brnHtml = null;
var isMobile = fnIsMobile();
var isTablet = fnIsTablet();
var mblOrientation = checkResponsiveOrientation();

this.switchState = function(state) {

	var brnBlock, brnOut, brnRegen, cautionImg, btnAgain, displaybrnOut, step3mbl, step3MsgDsk, step3MsgMbl;

	brnBlock = document.getElementById("brnCodeBlock");
	brnOut = document.getElementById("brnExpire");
	brnGenFail = document.getElementById("brnNotGenerated");
	cautionImg1 = document.getElementById("iconAttention1");
	cautionImg2 = document.getElementById("iconAttention2");
	cautionImg3 = document.getElementById("iconAttention3");
	cautionImg4 = document.getElementById("iconAttention4");
	step3MsgDsk = document.getElementById("step3CaptionDsk");
	step3MsgMbl = document.getElementById("step3CaptionMbl");

	switch (state) {
	case 'brnTimeout': {
		brnBlock.style.display = "none";
		step3MsgDsk.style.display = "none";
		step3MsgMbl.style.display = "none";
		brnOut.style.display = "block";

		if (isMobile || isTablet) {
			brnOut.style.display = "block";
			cautionImg1.style.display = "block";
			cautionImg4.style.display = "block";
		}
		if (!isMobile) {
			cautionImg1.style.display = "block";
		}
		if (isTablet) {
			brnOut.style.marginTop = "15%";
		}
		if(!closePopupFlag) {
			setBrnExpiredFocus();
		}
		
		break;
	}
	case 'requestFailure': {
		updateSize2();
		brnBlock.style.display = "none";
		brnGenFail.style.display = "block";
		step3MsgDsk.style.display = "none";
		step3MsgMbl.style.display = "none";
		var brnPopUp = document.getElementById("brnPopUp");
		var interPopUp = document.getElementById("intermediatePopUp");
		interPopUp.style.display = "none";
		brnPopUp.style.display = "block";
		brnBlock.style.display = "none";
		brnGenFail.style.display = "block";
		step3MsgDsk.style.display = "none";
		step3MsgMbl.style.display = "none";
		if (!isMobile) {
			cautionImg2.style.display = "block";
		}
		if (isMobile) {
			brnGenFail.style.display = "block";
			cautionImg2.style.display = "block";
			cautionImg3.style.display = "block";
		}
		break;
	}
	case 'transactionTimeout': {
		clearInterval(countdownTimer);
		displaybrnOut = brnOut.getAttribute("style");
		if (displaybrnOut.search("block") == -1) {
			brnBlock.style.display = "none";
			brnOut.style.display = "block";
			step3MsgDsk.style.display = "none";
			step3MsgMbl.style.display = "none";
		}
		setBrnExpiredFocus();
		break;
	}
	case 'brnRegenerate': {
		document.getElementById('brntimer').textContent = "";
		brnBlock.style.display = "block";
		brnGenFail.style.display = "none";
		brnOut.style.display = "none";
		if (!isMobile) {
			step3MsgMbl.style.display = "none";
			step3MsgDsk.style.display = "block";
		} else if (isMobile) {
			if(window.innerWidth > window.innerHeight) {
				step3MsgMbl.style.display = "none";
				step3MsgDsk.style.display = "block";
			} else {
				step3MsgMbl.style.display = "block";
				step3MsgDsk.style.display = "none";
			}
		} 
		
		
		break;
	}
	case 'noBankApp': {
		showBrnPop();
		break;
	}
	case 'showCode': {
		break;
	}
	case 'ready': {
		break;
	}
	default: {
	}
	}

}

function clearValues(countdownTimer,brnTimer) {
	clearInterval(countdownTimer);
	brnTimer.style.background = "none";
	brnTimer.textContent = "";
	var brnCodeBox = document.getElementsByClassName("numberCircle");
	var length = brnCodeBox.length;
	for (i=0; i < length; i++) {
		brnCodeBox[i].innerHTML = "";
	}
}

function countDownFrom(timeLeft) {
	brntimer.style.display == "none"
	brntimer.textContent = timeLeft--;
	if (timeLeft < 31) {
			brntimer.style.backgroundColor = "red";
	} else {
		brntimer.style.backgroundColor = "green";
	}
	countdownTimer = setInterval(function() {
		if (timeLeft < 31 && brntimer.style.backgroundColor != "red") {
			brntimer.style.backgroundColor = "red";
		}
		document.getElementById('brntimer').setAttribute("aria-label", timeLeft);
		if (timeLeft <= 0) {
			brntimer.textContent = timeLeft;
			switchState('brnTimeout');
			clearValues(countdownTimer,brntimer);
		} else {
			brntimer.textContent = timeLeft--;
		}
		if (brntimer.style.display == "none") {
			brntimer.style.display = "inline";
		}
		
	}, 1000);
}

if (typeof zapppopup != "undefined")
	zapppopup
			.documentReady(function() {
				var brnPopUp = document.getElementById("brnPopUp");
				var interPopUp = document.getElementById("intermediatePopUp");
				document.getElementById("brnPopUp").focus();
				interPopUp.style.display = "none";
				brnPopUp.style.display = "none";
				newImgSrc = zapp.getParameterByName('src');
				imageKey = zapp.getParameterByName('imageKey');
				zapp
						.registerXEventHandler({

							"com.zapp.popup.state" : function() {

								clickedButton = data.id;
								if (typeof data.id != "undefined")
									window.id = data.id;
								switchState(data.data);
							},
							"com.zapp.popup.data" : function() {

								window.id = data.id;
								window.data = data;

								if (data.data.brn != ""
										&& data.data.brn != null
										&& typeof data.data.brn !== "undefined") {

									var zappCode = [];
									var id = 1;
									countDownFrom(data.data.retrievalExpiryInterval);
									for (var idx = 0; idx < data.data.brn.length; idx++) {
										var brnId = "brn_" + id;
										document.getElementById(brnId).innerHTML = data.data.brn[idx];
										document.getElementById(brnId).setAttribute("aria-label", data.data.brn[idx]);
										id++;
									}

									brnHtml = zappCode.join("", zappCode);

								} else {
									brnHtml = null;
								}

								if (data.data.cfiShortName != ""
										&& data.data.cfiShortName != null
										&& typeof data.data.cfiShortName !== "undefined") {
									cfiShortName = data.data.cfiShortName;
								} else {
									cfiShortName = null;
								}
                                if (cfiShortName !=  null && cfiShortName.length > 0) {
                                    document.getElementById("cfiShortName").innerHTML = cfiShortName;
                                    document.getElementById("cfiShortNameText").setAttribute("aria-label", " Step 1 Open the notification from " + cfiShortName);
                                } else {
                                    document.getElementById("cfiShortName").style.color = "black";
                                    document.getElementById("cfiShortName").style.fontWeight = "normal";
                                }
								if (isMobile) {
									if (data.data.supportsZapp) {
										interPopUp.style.display = "block";
										brnPopUp.style.display = "none";
									}

								} else {
									interPopUp.style.display = "none";
									brnPopUp.style.display = "block";
									
		                            if (data.data.pcid != null)
		                            {
		                            	//This will open notification popup
		                            	switchBetweenPopup('notification');
		                            }else{
		                            	//This will open BRN popup
		                            	switchBetweenPopup('BRN');
		                            }
								}
								updateSize2();

							}

						});
			});
var brnContainer = document.getElementById('brnContainer');
var close = document.getElementById('closeBRNContainer');
var cfiLogos = [];
var cfiCDNUrl;
var libUrl;

function closeMoreAboutPopup() {
	var moreAboutIframe = document.getElementById('moreAboutIframe');
	if (moreAboutIframe) {
		document.body.removeChild(moreAboutIframe);
	}
}

function showMoreAboutPopup() {
	var moreAboutIframe = document.getElementById('moreAboutIframe');
	if (moreAboutIframe) {
		document.body.removeChild(moreAboutIframe);
	}
	moreAboutIframe = document.createElement('iframe');
	moreAboutIframe.setAttribute("class", "more-about-iframe");
	moreAboutIframe.setAttribute("id", "moreAboutIframe");
	moreAboutIframe.src = libUrl + "/html/more-about.html?url=" + cfiCDNUrl;
	document.body.appendChild(moreAboutIframe);
}
function openApp() {
	sendEvent("com.zapp.button.openapp.click");
}
function closePopupWindow() {
	closePopupFlag = false;
	brnContainer.style.display = "none";
	sendEvent('com.zapp.popup.close', window.id, []);
	parent.closeBRNPopup();
	}

function closePopupFocus(event){
	closePopupFlag = false;
	var key = event.keyCode;
	if(key == 9){
		document.getElementById("confirmDiv").focus();
	} else if(key == 13) {
		brnContainer.style.display = "none";
		sendEvent('com.zapp.popup.close', window.id, []);
		parent.closeBRNPopup();
	}
}

function cancelPopupFocus(event) {
	closePopupFlag = false;
	var key = event.keyCode;
	if(key == 9){
		return false;
	} else if(key == 13) {
		document.getElementById('wrapperDiv').style.display = "none";
		var blanket = document.getElementById('blanket');

		if (typeof blanket != "undefined" && blanket != null) {
			try {
				blanket.style.display = "none";
			} catch (e) {
				document.getElementById('blanket').parentNode
						.removeChild(window.parent.document
								.getElementById('blanket'));
			}
		}
	}
	
}
function cancelPopupWindow() {
	closePopupFlag = false;
	document.getElementById('wrapperDiv').style.display = "none";
	var blanket = document.getElementById('blanket');

	if (typeof blanket != "undefined" && blanket != null) {
		try {
			blanket.style.display = "none";
		} catch (e) {
			document.getElementById('blanket').parentNode
					.removeChild(window.parent.document
							.getElementById('blanket'));
		}
	}
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
function controlFocusBrnPopup(event) {
	  var key = event.keyCode;
	  if(key == 9){
		  document.getElementById("closeBRNContainer").blur();
			document.getElementById("pbbaLogoId").focus();
	  } else if(key == 13) {
		  closePopup();
	  }
	}


window.onload = function() {
	var cfiLogoArray=[], count=1, brnIframe = document.getElementById('brnIframe');
	document.getElementById("pbbaLogoFocus").focus();
	libUrl = getQueryParams()["libUrl"];
	cfiCDNUrl = getQueryParams()["cfiCDNUrl"];
	parent.readJSONFile(cfiCDNUrl);
	setTimeout(
			function() {
				cfiLogos = parent.getCfiLogosLong(true);
				var length = cfiLogosLength(cfiLogos);
				cfiLogoLength = length;
				if (length > 8) {
					length = 8;
				}
				for (cfiName in cfiLogos) {
					cfiLogoArray.push(count);
					var img = document.createElement('img');
					img.setAttribute('class', 'cfiLogo');
					img.setAttribute('role', 'img');
					img.setAttribute('src', cfiLogos[cfiName]);
					img.alt = cfiName;
					img.id = count;
					count++;
					if (isTablet) {
						if (mblOrientation === 'Potrait') {
							document.getElementById('cfiLogos-mobile')
									.appendChild(img);
							document.getElementById('cfiLogos-mobile').setAttribute('aria-labelledby',cfiLogoArray.join(" "));
						}
						if (mblOrientation === 'Landscape') {
							var ele = document.getElementsByClassName('desktopCfi');
							var sm_ele = document.getElementsByClassName('smDesktopCfi');
							for (var i = 0; i < ele.length; i++ ) {
								ele[i].style.display = "none";
							}
							for (var i = 0; i < sm_ele.length; i++ ) {
								sm_ele[i].style.display = "block";
							}
							document.getElementById('cfiLogosSmDesktop')
									.appendChild(img);
							document.getElementById('cfiLogosSmDesktop').setAttribute('aria-labelledby',cfiLogoArray.join(" "));
						}
					} else if (isMobile) {
						document.getElementById('cfiLogos-mobile').appendChild(
								img);
						document.getElementById('cfiLogos-mobile').setAttribute('aria-labelledby',cfiLogoArray.join(" "));
					} else {
						document.getElementById('cfiLogos').appendChild(img);
						document.getElementById('cfiLogos').setAttribute('aria-labelledby',cfiLogoArray.join(" "));
						
					}
				}
				
				isCfiLogo(cfiLogoLength);
				
			}, 500);
	
}

window.addEventListener("orientationchange", function() {
	if (isTablet) {
		document.getElementById('cfiLogos-mobile').innerHTML = '';
		document.getElementById('cfiLogos').innerHTML = '';
		document.getElementById('cfiLogosSmDesktop').innerHTML = '';
	}
	parent.readJSONFile(cfiCDNUrl);
	cfiLogos = parent.getCfiLogosLong(true);
	var length = cfiLogosLength(cfiLogos);
	if (length > 8) {
		length = 8;
	}
	for (cfiName in cfiLogos) {
		var img = document.createElement('img');
		img.setAttribute('class', 'cfiLogo');
		img.setAttribute('src', cfiLogos[cfiName]);
		img.alt = cfiName;
		if (isTablet) {
			if (window.orientation == 90) {
				document.getElementById('cfiLogosSmDesktop').appendChild(img);
				var ele = document.getElementsByClassName('desktopCfi');
				var sm_ele = document.getElementsByClassName('smDesktopCfi');
				for (var i = 0; i < ele.length; i++ ) {
					ele[i].style.display = "none";
				}
				for (var i = 0; i < sm_ele.length; i++ ) {
					sm_ele[i].style.display = "block";
				}
			} else {
				document.getElementById('cfiLogos-mobile').appendChild(img);
			}
		}
	}
}, false);


cfiLogosLength = function (cfiLogos) {
	length = 0;
	for (var object in cfiLogos) {
	length++;
	}
	return length;
}

function newRequest() {
	sendEvent("com.zapp.button.regen.click");
	switchState('brnRegenerate');
	switchBetweenPopup('BRN');
	document.getElementById("pbbaLogoId").focus();
}

function sendEvent(type, id, data) {
	var postData = {
		id : window.id,
		eventType : type,
		data : data
	};
	window.parent.postMessage(JSON.stringify(postData), '*');
}

/*
 * This function is created to prepare pop Notification Specific.
 */
function switchBetweenPopup(popup) {
	var brnPopElement = [ "step1Wrapper", "step2Wrapper", "step3BrnPopup" ,"step3CaptionDsk", "brnCodeBlock","step3WrapperBlock"];
	var notificationPopElement = [ "step1NotificationPopup", "step2NotificationPopup","step3NotificationPopup" ];
	if ((popup == 'BRN') || (popup == "undefined")) {
		
		// display BRN popup contents
		for (i = 0, len = brnPopElement.length, text = ""; i < len; i++) {
			document.getElementById(brnPopElement[i]).style.display = "block";
		}
		
		
		var brnExpireBlock = document.getElementById("brnExpire").getAttribute("style");
		if (brnExpireBlock !== null && 	brnExpireBlock.search("block") != -1) {
			document.getElementById("brnCodeBlock").style.display = "none";
		}
		
		//Remove NOTIFICATION popup contents
		for (i = 0, len = notificationPopElement.length, text = ""; i < len; i++) { 
			document.getElementById(notificationPopElement[i]).style.display = "none";
		}
	}else if(popup=='notification'){
		//display NOTIFICATION popup contents
		for (i = 0, len = notificationPopElement.length, text = ""; i < len; i++) { 
			document.getElementById(notificationPopElement[i]).style.display = "block";
		}

		//Remove BRN popup contents
		for (i = 0, len = brnPopElement.length, text = ""; i < len; i++) { 
			document.getElementById(brnPopElement[i]).style.display = "none";
		}
	}
}