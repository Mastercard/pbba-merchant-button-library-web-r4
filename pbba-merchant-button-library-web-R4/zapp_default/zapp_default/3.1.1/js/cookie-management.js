/** Copyright 2016 IPCO 2012 Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

/**
 * This is the cookie management script which loads a cookie in an iframe. This
 * is needed for establishing pay connect.
 */
function setCookie(key, value, cookieExpiryDays, url) {
	if (!isCookieEnabled()) {
		return;
	}
	if (isTPCookieDisabled()) {
		redirectToCookieManagementUrl(url, value, cookieExpiryDays);
	} else {
		var iframe = document.getElementById('pcid-iframe');
		iframe.src = url + "index.html?pcid=" + value
				+ "&cookieExpiryDays=" + cookieExpiryDays;
	}

}