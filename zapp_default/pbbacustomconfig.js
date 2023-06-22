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

/*
 * This is a sample configuration file to be used as a reference for
 * implementing:
 * 
 * 1. Native Pay By Bank App Button 2. Custom Merchant Button calling the PBBA
 * popup.
 * 
 */

/*
 * START USER DEFINED VARIABLES
 * 
 * Change the values of these variables appropriately
 * 
 */

/* START optional variables. Only for this demo */
window.zapppopup = window.zapppopup || {};

jQuery.support.cors = true;
if (!window.console)
	console = {
		log : function() {
		}
	};

var notifyXhr = null; // This variables holds a reference to the notify AJAX
// call. This value will never change.
var distUrlVersion = localStorage.getItem('gatewayVersion') || "${dist.gateway.context}"; // This is the distributor URL version. Update
//this to the latest gateway version when
//needed.
var distGateway = localStorage.getItem('gatewayUrl') || "${dist.gateway.url}";

var distGatewayUrl =  distGateway + distUrlVersion + "/" ; // This is the distributor


// gateway URL.
var rtpContext = "4/transaction"; // This is context for posting transactions
// to the distributor gateway.
var notifyContext = "4/transaction"; // This is the context for getting
// notifications from the distributor
// gateway.
var cfiLogosURL = localStorage.getItem('cdnUrl') || "${cfi.logo.cdn}";
var appManifestURL = "${app.manifest.url}";
/* END optional variables. Only for this demo */

/* START mandatory variables. Only for this demo */

var zappVersion = "${lib.version}"; // This is the current web merchant button library
// version. Update when new library is available.
var cookieManagementUrl = "${cookie.management.url}"; //"https://paybybankappcookie.mastercard.co.uk/static/cookie-management/pbba-3550ce7763041531b9214e9e23986b37/"; // This is the URL for the cookie management
// script. This URL will almost never
// change.
var merchantPollInterval = 10000;
/* END mandatory variables. Only for this demo */
var clickedButton = null;
var abort = false;
var linkingType = "AOF";
var apiName;
var secureTokenForCustomNotify = null;
var libCallback = null;

if(!localStorage.getItem('env') || localStorage.getItem('env') == '' || localStorage.getItem('env') == null) {
	console.log('Initially setting env if not');
	localStorage.setItem('env', 'demo');
	localStorage.setItem('gatewayVersion', 'distributor-gateway-r4_demo');
	localStorage.setItem('gatewayUrl', '${dist.gateway.url}');
	localStorage.setItem('cdnUrl', '${cfi.logo.cdn}');
}

var getEnv = (localStorage.getItem('env') != null) ? localStorage.getItem('env') : 'demo';

/* Enable this if the web page contains just the custom merchant pay button. */
// Initialise Cookie Management functionality.
window.onload = function() {
	initCookieMgmt(cookieManagementUrl, document);
}

/*
 * START BRANDED WEB MERCHANT BUTTON LIBRAY IMPLEMENTATION.
 */

function linkPayMitSelection() {
	linkingType = document.getElementById("linkPayMitDropdown").value;
}

function changeEnableLinkAndPay() {
	var val = document.getElementById('enableLinkAndPay').checked;
	if(val === false) {
		document.getElementById("linkPayMitDropdown").selectedIndex = 0;
		linkingType = "AOF";
	}
}

zapp
		.load(
				zappVersion,
				{
					pay : function(data, callback) {

						var _data = data;
						var merchantLinkingFlag = document.getElementById('enableLinkAndPay').checked ? 1 : 0;
						
						var postData = {
							productId : data.productId,
							linkingType : linkingType,
							merchantLinkingFlag : merchantLinkingFlag,
							merchantCallbackUrl : "${merchant.callback.url}/${project.name}/resources/html/action.html?action=redirect",
							browserInfo : JSON.stringify(data.browserInfo),
							gatewayUrl : distGatewayUrl + rtpContext
						};
						console.log(JSON.stringify(postData));

						if (typeof data.pcid !== "undefined" && !merchantLinkingFlag){
							if(getEnv !== null && (getEnv == 'sprint' || getEnv == 'dev')) {
								postData.pcid = null;
							}else {
								postData.pcid = data.pcid;	
							}
							apiName = "RequestToPay";
						} else {
							postData.pcid = null;
							apiName = "RequestToLinkAndPay";
						}		

						//Clear brn timer and transaction timer before create new request
						zapppopup._stopTimers();
						jQuery
								.ajax({
									url : "/${project.name}/postOrder",

									type : "POST",
									crossDomain : true,
									data : postData,
									headers : {
										"accept" : "application/json; charset=UTF-8"
									},
									success : function(res) {
										secureTokenForCustomNotify = res.secureToken;
										libCallback = callback;

										var response = new zapppopup.response.payment(
												{
													success : true,
													secureToken : res.secureToken,
													aptid : res.aptId,
													brn : res.brn,
													amount : data.amount,
													retrievalExpiryInterval : res.retrievalExpiryInterval,
													confirmationExpiryInterval : res.confirmationExpiryInterval,
													notificationSent : res.notificationSent,
													pcid : null,
													cfiShortName : res.cfiShortName,
													requestType: apiName,
												});

										callback(response);
									},
									error : function(res) {
										callback(new zapppopup.response.payment(
												{
													success : false,
													data : res
												}));
									}
								});
					},
					notify : function(secureToken, callback) {

						if(getEnv !== null && getEnv == 'demo') {

						console.log("notify", secureToken);

						var _callback = callback;

						var _confirmOrder = function(data) {
							var param = '';
							var _orderData = data;
							_orderData.pollingUrl = distGatewayUrl
									+ notifyContext;
							_orderData.secureToken = secureToken;
							_orderData.env = getEnv;
							
							if(data.ocrDesc == 'Immediate' && data.txnStatus == '0') {
								param = 'success';
								localStorage.setItem('rtpTxnStatus', 'success');
							}else {
								param = 'decline';
								localStorage.setItem('rtpTxnStatus', 'failure');
							}
							_orderData.txnParam = param;

							jQuery.ajax({
								type : 'post',
								url : "/${project.name}/order/success",
								crossDomain : true,
								data : {
									jsonArray : JSON.stringify(_orderData)
								},
								success : function(res) {
									res = JSON.parse(res);
									if(typeof(res.merchantLinkedFlag) == "undefined"){
										if (typeof res.pcid !== "undefined") {
											setCookie("pcid", res.pcid,
													res.cookieExpiryDays,
													cookieManagementUrl);
										}
									}

									if (res.status === 'success') {
										console.log(res);
										setTimeout(function() {
											window.location = "/${project.name}/"
													+ res.html;
										}, 3000);

									} else {
										setTimeout(function() {
											window.location = "/${project.name}/"
													+ res.html;
										}, 3000);
									}
								}
							});
						};

						var nothing = null;

						jQuery
								.ajax({
									url : distGatewayUrl + notifyContext + "/"
											+ secureToken,
									dataType : "json",
									crossDomain : true,
									cache : false,
									contentType : "application/json; charset=UTF-8",
									type : "GET",
									success : function(data) {

										console.log("Notify Res", data);

										if (typeof data.errorCode === "undefined") {

											data.success = true;

											if (typeof data.guid !== "undefined") {
												data.pcid = data.pcid;
											}

											var response = new zapppopup.response.notify(
													{
														success : true
													});
											_callback(response);

											_confirmOrder(data);

										}
									},
									error : function(data) {
										console.log('error');
										var response = new zapppopup.response.notify(
												{
													success : false,
													data : data
												});
										_callback(response);
									}
								});
						}
					},
					error : function(errors) {
						console.log(errors);
						alert(errors);
					},
					cookieManagementUrl : cookieManagementUrl,
					merchantPollInterval : merchantPollInterval,
					cfiLogosURL : cfiLogosURL,
					appManifestURL: appManifestURL
				});

/*
 * END BRANDED WEB MERCHANT BUTTON LIBRAY IMPLEMENTATION.
 */
function listener(event) {
	try {
	var data = JSON.parse(event.data);
	} catch (exception) {
		return;
	}

	//Based on gateway selection 'sprint' we need to enable this,
	//manual acknowledge of notify of payment accepted or declined
	if(getEnv !== null && (getEnv == 'sprint' || getEnv == 'dev')  && data.eventType == "pbba.popup.notify.close") {
		abort = true;	
		parent.closeBRNPopup();	
		zapppopup._stopTimers();	
		zapppopup._removePopup(true);
		document.getElementById('notifyWrapper').style.display = "block";
		document.getElementById("successNotifyBtn").addEventListener("click", e=>acceptedPaymentClick(e,'success')); 
		document.getElementById("failureNotifyBtn").addEventListener("click", e=>acceptedPaymentClick(e,'decline'));
		document.getElementById('notifyDropdown').addEventListener("change", e=> notifyDropdownChange(e));
		document.getElementById("closeCustomNotify").addEventListener("click",function(event){
			window.location.reload();
			document.getElementById('notifyWrapper').style.display = "none";
		});
	}
}

if (window.zAddEventListener) {
	addEventListener("message", listener, false)
} else {
	attachEvent("onmessage", listener)
}


function notifyDropdownChange(e) {
	if(e.target.value === "MCOMM") {
		document.getElementById("failureNotifyBtn").classList.add("hide")
		document.getElementById("successNotifyBtn").classList.add("hide")
	}else {
		document.getElementById("failureNotifyBtn").classList.remove("hide")
		document.getElementById("successNotifyBtn").classList.remove("hide")
	}
}

function acceptedPaymentClick(e, param) {
	fetchSuccessFailureRes = null;

	var _confirmPayment = function(data) {
		var _orderData = data;
		_orderData.pollingUrl = distGatewayUrl + notifyContext;
		_orderData.secureToken = secureTokenForCustomNotify;
		_orderData.env = getEnv;
		_orderData.txnParam = param;
		jQuery.ajax({
			type : 'post',
			url : "/${project.name}/order/success",
			crossDomain : true,
			data : {
				jsonArray : JSON.stringify(_orderData)
			},
			success : function(res) {
				res = JSON.parse(res);
				if(typeof(res.merchantLinkedFlag) == "undefined") {
					if (typeof res.pcid !== "undefined") {
						setCookie("pcid", res.pcid,
								res.cookieExpiryDays,
								cookieManagementUrl);
					}
				}

				setTimeout(function() {
					window.location = "/${project.name}/"+ res.html
				}, 3000);
			}
		});
	};

	var URLSchema  = '';
	URLSchema = distGatewayUrl + notifyContext + "/" + secureTokenForCustomNotify + "/" + param;
	jQuery.ajax({
		url : URLSchema,
		dataType : "json",
		crossDomain : true,
		contentType : "application/json; charset=UTF-8",
		type : "GET",
		headers : {
			"accept" : "application/json; charset=UTF-8"
		},
		success : function(data) {
			console.log("fetchSuccessFailure Res", data);
			zapppopup._stopTimers();
			zapppopup._removePopup(true);
			parent.closeBRNPopup();
			document.getElementById('notifyWrapper').style.display = "none";
			// _confirmPayment(data);
			console.log('success', JSON.stringify(data));

			if (typeof data.errorCode === "undefined") {
				data.success = true;
				if (typeof data.guid !== "undefined") {
					data.pcid = data.pcid;
				}
				var response = new zapppopup.response.notify(
						{
							success : true
						});
				libCallback(response);
				_confirmPayment(data);
			}
		},
		error : function(data) {
			console.log('error');
			zapppopup._stopTimers();	
			zapppopup._removePopup(true);
			var response = new zapppopup.response.notify({
				success : false,
				data : data
			});
			libCallback(response);
		}
	});
}

var redirectionInterval = setInterval(function() {
	// if(localStorage.getItem('env') === 'sprint' || localStorage.getItem('env') === 'dev') {
	if(localStorage.getItem('rtpTxnStatus') == 'success'){
		localStorage.setItem('rtpTxnStatus', '');
		clearInterval(redirectionInterval);
		window.location = "${server.url}/${project.name}/success" + "?redirectTo=success";
	}
	if(localStorage.getItem('rtpTxnStatus') == 'failure'){
		localStorage.setItem('rtpTxnStatus', '');
		clearInterval(redirectionInterval);
		window.location = "${server.url}/${project.name}/failure" + "?redirectTo=failure";
	}
	// }
}, 3000);

