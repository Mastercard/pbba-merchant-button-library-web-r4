const parsedManifestSignedData = [];
const manifestDataSeparator = '.';		//Manifest signed data separator.
const manifestDataArraySize = 3;		//Signed Manifest data array length
const headerIndexInManifestData = 0; 	//Signed Header Index in Manifest data ie. 0
const payloadIndexInManifestData = 1;	//Signed Payload Index in Manifest data ie. 1
const signatureIndexInManifestData = 2;	//Signed Signature Index in Manifest data ie. 2
const certificateExtension = ["cer", "pem"];

var getPayloadWithSignatureData = async (appManifestUrl, manifestResponse,isVerificationRequiredFlag) => {
	try {
		const manifestParsedData = manifestResponse.split(manifestDataSeparator);
		
		//Check manifest file data with header,payload and signature
		if(manifestParsedData.length != manifestDataArraySize)	return false;  
		//check empty header,payload and signature data
		if(manifestParsedData[headerIndexInManifestData] == '' || manifestParsedData[payloadIndexInManifestData] == '' || manifestParsedData[signatureIndexInManifestData] == '') return false;
		
		//check sequence of the response data, should be header,payload,signature
		if((JSON.parse(decodeBase64ToString(manifestParsedData[headerIndexInManifestData])).alg == undefined) || (JSON.parse(decodeBase64ToString(manifestParsedData[payloadIndexInManifestData])).apps == undefined)) return false;

		parsedManifestSignedData.headerData = JSON.parse(decodeBase64ToString( manifestParsedData[headerIndexInManifestData]));
		parsedManifestSignedData.payloadData = JSON.parse(decodeBase64ToString(manifestParsedData[payloadIndexInManifestData]));
		parsedManifestSignedData.signatureData = manifestParsedData[signatureIndexInManifestData];		
		
		//check if appManifestUrl and x5u have the same hostnames
		var appManifestHostname = new URL(appManifestUrl).hostname;
		var x5uHostname = new URL (parsedManifestSignedData.headerData.x5u).hostname;
		if(appManifestHostname.localeCompare(x5uHostname) != 0) return false;
		
		//check header data undefined/empty
		if((parsedManifestSignedData.headerData.alg == undefined) || (parsedManifestSignedData.headerData.x5u == undefined) || (parsedManifestSignedData.headerData.typ == undefined)) return false;
		if((parsedManifestSignedData.headerData.alg == null) || (parsedManifestSignedData.headerData.x5u == null) || (parsedManifestSignedData.headerData.typ == null)) return false;
		
		if(certificateExtension.includes(parsedManifestSignedData.headerData.x5u.split(/[#?]/)[0].split('.').pop().trim()) == false) return false;
		
		// check for verification required or not
		if(isVerificationRequiredFlag){	
			//If validation is mandatory from merchant
			return await keyValidationManifestfile(manifestResponse);
		}else{
			return parsedManifestSignedData.payloadData; 
		}		
	} catch (err) {
		return false;
	}
}

/**
 * To verify signed manifest data and return payload data
 * @param  {String} manifestResponse encoded manifest list data
 * @return {String} Return payload data
 */
const keyValidationManifestfile = async (manifestResponse) => {
	var algorithmType = (parsedManifestSignedData.headerData.alg) ? new Array(parsedManifestSignedData.headerData.alg): ['RS256']; 
	var publicCertUrl = parsedManifestSignedData.headerData.x5u;
	var publicKey = await fetchPublicCertificate(publicCertUrl); 
	if(publicKey == '' || publicKey == undefined) return false;

	var parsedPublicKey = retrievedParsedPublicKey(publicKey);
	if(parsedPublicKey == '' || parsedPublicKey == undefined) return false;
	
	var result = verifySignedManifestFile(manifestResponse, parsedPublicKey, algorithmType);
	if(result) return parsedManifestSignedData.payloadData; 
	else return false;
}

/**
 * To fetch and return certificate data from url
 * @param  {String} url cerificate url to fetch
 * @return {String} Return the public certificate data from url
 */
 const fetchPublicCertificate = async (url) => {
	var retreievedPubCert = '';
	return fetch(url).then((response) =>  response.text()
	).then((text) => {
		retreievedPubCert = text;
		return retreievedPubCert;
	});	
}

/**
 * To validate and retrieve parsed public key
 * @param  {String} retreieved Certificates data
 * @return {String} Return the public key
 */
function retrievedParsedPublicKey(encodedCertificate) {
	var x509keyExtract = new X509();
	x509keyExtract.readCertPEM(encodedCertificate.split('-----END CERTIFICATE-----\n')[0].concat('-----END CERTIFICATE-----\n'));
	var pk  = KEYUTIL.getPEM(x509keyExtract.getPublicKey());
	return pk;
}

/**
 * To verify signed manifest data
 * @param  {String} manifestResponse encoded manifest list data
 * @param  {String} pubkey public key from certificate data
 * @param  {String} algorithmType from header data
 * @return {Boolean} Return verification result
 */
function verifySignedManifestFile(manifestResponse, pubkey, algorithmType) {
	return window.KJUR.jws.JWS.verifyJWT(manifestResponse, pubkey, { alg: algorithmType });
}


/**
 * Encode String to Base64
 * @param dataString: String the need to encode to base64
 * @return String : Base 64 encoded string
 **/
function encodeStringToBase64(dataString) {
    return btoa(dataString);
}

/**
 * Decode Base64 to String
 * @param dataString: String the need to String
 * @return String : decoded string
 **/
function decodeBase64ToString(dataString) {
    return atob(dataString);
}