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

/**
 * Collection of Zapp library classes
 * @constructor
 * @type Object
 */

window.zapp = window.zapp || {};
var cookieManagementDomain = null;
var cookieManagementURL = null;
var pbbaCookies = {};
var PCID_COOKIE = "pcid";
var HAS_APP_COOKIE = "hasApp";
var TP_COOKIE_DISABLED_COOKIE = "TPCookieDisabled";

function extractDomain(url) {
    var domain;
    // find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    // find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function zAddEventListener(type, listener)
{

    console.log(this, type);

    if (typeof addEventListener === "undefined")
    {
        if (typeof this.attachEvent === "undefined")
            attachEvent(type, listener);
        else
            this.attachEvent(type, listener);
    }
    else
    {
        if (typeof this.addEventListener === "undefined")
            addEventListener("on" + type, listener);
        else
            this.addEventListener("on" + type, listener);
    }
}

(function() {

    function urlofdoc(jsfile)
    {
        var scriptElements = document.getElementsByTagName('script');
        var i, element, myfile;
        for (i = 0; element = scriptElements[i]; i++) {
            myfile = element.src;
            if (myfile.indexOf(jsfile) >= 0)
                var myurl = myfile.substring(0, myfile.indexOf(jsfile));
        }
        return myurl;
    }

    zapp.register = "registered"
    
    zapp.versions = {
        "1.0.0": {
            path: "1.0.0",
            file: "button.js"
        },
        "1.1.0": {
            path: "1.1.0",
            file: "button.js"
        },
        // adding new version
        "1.2.0": {
            path: "1.2.0",
            file: "button.js"
        },
        "2.0.0": {
            path: "2.0.0",
            file: "button.js"
        },
        "2.0.7": {
            path: "2.0.7",
            file: "button.js"
        },
        "3.0.0": {
            path: "3.0.0",
            file: "button.js"
        },
        "3.0.1": {
            path: "3.0.1",
            file: "button.js"
        },
        "3.1.0": {
            path: "3.1.0",
            file: "button.js"
        },
        "3.1.1": {
            path: "3.1.1",
            file: "button.js"
        },
        "4.0.0": {
            path: "4.0.0",
            file: "button.js"
        }
    };

    zapp.addJsFile = function(url)
    {
    	var script=document.createElement('script');
		script.setAttribute('src',url);
		script.setAttribute('type','text/javascript');
		document.getElementsByTagName('head')[0].appendChild(script);
    };

    zapp.url = urlofdoc('zapp.js');
    zapp.buttonItems = {};
    zapp.buttonCount = 0;
    zapp.available = true;
    zapp.payConnectItem = null;

    zapp.button = function(options)
    {
        this.id = zapp.buttonCount;
        this.options = options;
        var eleId = 'zapp-button-' + this.id;
        document.write('<div id="' + eleId + '" class="zapp-button"></div>');
        this.ele = document.getElementById(eleId);
        zapp.buttonItems[this.id] = this;
        zapp.buttonCount++;
    };

    zapp.payConnect = function(params)
    {
        var self = this;
        document.write('<div id="zapp-pay-connect" class="zapp-pay-connect" style="display: inline-block; vertical-align: top;"></div>');
        this.payConnectItem = {params: params, ele: document.getElementById('zapp-pay-connect')};
    };

    zapp.load = function (version, options) {

        if (!this.available)
            throw "The Zapp libary is currently not available";
        
        if (typeof this.versions[version] === "undefined")
            throw "ZAPP LOADER - Version " + version + " not found";
        
        this.version = version;
        this.libUrl = this.url + this.versions[version].path;

        this.addJsFile(this.libUrl + "/js/" + this.versions[this.version].file, 'Zapp' + this.version);

        this.options = options;

    };

    if (window.attachEvent && !window.addEventListener && typeof window.JSON === "undefined")
    {
        throw "The Zapp web library does not support browsers set in Quirks Mode";
        zapp.available = false;
    }

})();

function getQueryParams() {
	var qParams = location.search.substring(1).split('&');
	var vars = {};
	var hash= [];
	for(var i = 0; i < qParams.length; i++)
    {
        hash = qParams[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function ReadCookie(name)
{
  name += '=';
  var parts = document.cookie.split(/;\s*/);
  for (var i = 0; i < parts.length; i++)
  {
    var part = parts[i];
    if (part.indexOf(name) == 0)
      return part.substring(name.length)
  }
  return null;
}

function isCookieEnabled(){
    var cookieEnabled=(navigator.cookieEnabled)? true : false;
    if (typeof navigator.cookieEnabled=="undefined" && !cookieEnabled){ 
        document.cookie="testcookie";
        cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;
    }
    return (cookieEnabled) ? true : false;
}

function refreshPcidIframe(url) {
	var iframe = document.getElementById('pcid-iframe');
	if (typeof iframe != 'undefined' && iframe != null) {
		if (iframe.src.indexOf("cookie-management") == -1)
			iframe.src = url + "index.html";
	}
}

function cookieExists(cookie) {
	return (document.cookie.indexOf(cookie) != -1 ) ? true : false;
}

function isTPCookieDisabled() {
	return cookieExists(TP_COOKIE_DISABLED_COOKIE);
}



function deleteCookie(name) {
	
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}

function createCookie(name) {
	
	document.cookie = name + '=;path=/';
}
function createPcidIframe(url, document) {
	if (isTPCookieDisabled()) {
		return;
	}
	var iframe = document.getElementById('pcid-iframe');
	if (typeof iframe == 'undefined' || iframe == null) {
		var doc = document;
		 iframe = doc.createElement('iframe');
		 iframe.id="pcid-iframe";
	     iframe.style.display = "none";
	     doc.body.appendChild(iframe);
	     iframe.src = url + "index.html";
	}
	return iframe;
}

function readPBBACookies() {
	refreshPcidIframe(cookieManagementURL);
}

function initCookieMgmt(url, document) {
	if (!isCookieEnabled()) {
		return;
	}
	
	cookieManagementDomain = extractDomain(url);
	cookieManagementURL = url;
	createPcidIframe(url, document);
}


function redirectToCookieManagementUrl(url, pcid, cookieExpiryDays) {
	
	var xmlhttp = new XMLHttpRequest();
	var refURL = window.location.href;
	if (xmlhttp.withCredentials === undefined) {
		xmlhttp = new XDomainRequest();
	}
	
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if (xmlhttp.status == 200) {
        	   console.log(url + " is reachable.");
        	   setTimeout(function(){
           			window.location.href = url +  "index.html?pcid="+pcid+"&cookieExpiryDays="+cookieExpiryDays+"&refURL="+refURL;
           		}, 10);
           		deleteCookie(TP_COOKIE_DISABLED_COOKIE);     
           } else {
        	   console.log(url + " is not reachable");
           }
        }
    };
    
    xmlhttp.open("HEAD", url +  "index.html", true);
    xmlhttp.send();
	
}



function listener(event){

	if (typeof event.data.indexOf == "undefined") {
		return;
	} 
	
	if (event.data.indexOf("read-pbba-cookies") == 0) {
	    readPBBACookies();
	    return;
	}
	
	var origin = event.origin.toString();
	
	if (origin.indexOf(cookieManagementDomain) == -1 )
		    return
	
    if (event.data.indexOf(PCID_COOKIE) != 0 && event.data.indexOf(HAS_APP_COOKIE) != 0 && event.data.indexOf(TP_COOKIE_DISABLED_COOKIE) != 0)
	    return
	
	if (event.data.indexOf(TP_COOKIE_DISABLED_COOKIE) == 0) {
		createCookie(TP_COOKIE_DISABLED_COOKIE);
		return;
	}
	
	if (event.data.indexOf(HAS_APP_COOKIE) == 0) {
		if (typeof event.data.split('=')[1] != "undefined") {
			document.cookie = "hasApp=" + event.data.split('=')[1]  + '; path=/';
		} else {
			deleteCookie("hasApp");
		}
	    
	}
	
	if (event.data.indexOf(PCID_COOKIE) == 0) {
		if (event.data.split('=')[1] != "dummy")
			document.cookie = "pcid=" + event.data.split('=')[1]  + '; path=/';
	}
	
	
	
	  
}

if (window.addEventListener){
  addEventListener("message", listener, false)
} else {
  attachEvent("onmessage", listener)
}
