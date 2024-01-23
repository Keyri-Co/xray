# Keyri XRAY:
### Enhanced Security, Improved User Experience.

Keyri X-RAY effectively reduces fraud risks in your app while maintaining a seamless user experience. 

# Client Side

### Installation
Easily integrate Keyri X-RAY using NPM/Yarn or directly from a CDN.

#### Using NPM/Yarn:
```bash
npm i @keyri/xray --save
```

#### Using CDN:
```html
<!-- Adding library from NPM via UNPKG -->
<script type="module" >

    // Pull Library from CDN
    import {XRAY} from 'https://unpkg.com/@keyri/xray/index.mjs';

</script>
```

### Usage
Simple steps to integrate and use the Keyri X-RAY library:

```javascript
const _xray = new XRAY();    // Instantiate the library
await _xray.load();          // Load into memory
const xray = _xray.xray;     // Expose the main functionality

// Perform Local Analysis
const encrypted_fraud_data = await xray.scan({"apiUrl": "local"});

```

### Data Transmission
Send the collected data to _your_ server using your preferred method (XHR, WebSockets, WebRTC, etc.).

Example payload: 

```json
{
    "encryptedB64Payload": "eyJjbGllbnRFbmNyeX...U4UmVJK09wOHc9PSJ9"
}
```

# Server Side

### Installation
No additional installation needed on the server side.

### Usage

Create a JSON payload and make a REST POST request to our API.

```javascript

  const url = "https://fp.keyri.com/v1/client";

  // Create Payload
  const sendBody = {
    "encryptedB64Payload": "eyJjbGllbnRFbmNyeX...U4UmVJK09wOHc9PSJ9",
    "userId": "undefined",
    "eventType": "visits",
    "metadata": {},
    ipAddress,
    headers: event.headers,
    API_Key,
    Service_Encryption_Key,
    Service_Decryption_Key
  };
  
  // Send and receive response
  let returnData = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(sendBody)
  });
  
  let returnDataJson = await returnData.json();


```



### Decrypted Object

* `riskSummary`:  Outcome based on your risk settings (e.g., "warn", "allow", "deny").

* `ipAddress`: Client's IP address.

* `ipLocationData`: Geographical data derived from IP (city, region, country, and time zone)

* `userId`: User ID in your system.

* `deviceId`: Unique device ID.

* `wagId`: Liberal device ID - similar across browsers.

* `signals`: Suspicious signals detected.

* `trustScore`: A score between 0 and 1, based on browser metrics, behavioral analytics, and Bayesian machine learning. A higher score indicates a "good" user.

* `changes`: Recorded changes to user or device.

* `event_type`: Type of logged event.

* `deviceAge`:  Age of the device ID in _your_ service.

* `globalDeviceAge`: Age of the device ID across _any_ service.

* `timestamp`: Time of the API's assessment.

* `clientPublicSignatureKey`: Key for verifying the encrypted object's signature.

* `instance`: Data available for rules engine processing.

Example of a typical decrypted response:

```json
{
    "ipAddress": "6.6.6.6",
    "userId": "Bad@Guy.com",
    "deviceId": "6c6d32ed-50...-c453429b3d5b",
    "wagId": "NFDp7Gg0vv...MMAaDTKWP0=",
    "signals": [
        "multiple_account_signups_per_device",
        "multiple_account_access_per_device"
    ],
    "trustScore": 0.11329117957360035,
    "changes": [],
    "event_type": "signup",
    "deviceAge": 157.31792944444445,
    "globalDeviceAge": 168.628485,
    "timeStamp": 1688905691858,
    "riskSummary": "deny",
    "ipLocationData": {
        "city": "Dallas",
        "region": "Texas",
        "country": "US",
        "time_zone": "CDT"
    },
    "instance": {
        ...
    }
}
```
---
# COMPLETE EXAMPLE 

### Client (`index.html`)
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charSet="utf-8"/>
    </head>
    <body>
        <h1>GOODBYE FRAUD!</h1>
    </body>

    <!-- Adding library from NPM via UNPKG -->
    <script type="module" >

        // Pull Library from CDN
        import {XRAY} from 'https://unpkg.com/@keyri/xray@2.0.0/index.mjs';

        // n.b. when full production, `XRAY` needs no args
        //
        const _xray = new XRAY(iframe_url);             // Instantiate the wrapper class
        await _xray.load();                             // Load the library into memory
        const xray = _xray.xray;                        // `.xray` is the actual worker here

        let encrypted_fraud_data = await xray.scan({"apiUrl": "local"});

        // USE YOUR OWN API IN REAL LIFE!!!
        // (but you can use mine for now...)
        const your_data_handler_url = "https://jv1buh5aac.execute-api.eu-central-1.amazonaws.com/prod";

        try{
            
            const data_response = await fetch(your_data_handler_url, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(encrypted_fraud_data)
            });

            const data = await data_response.json();

            console.log({data});

        } catch(e){
            console.error(e);
        }



    </script>

</html>
```

### Server (`aws-lambda`)
```javascript
// Set default response headers as `const`
let DEFAULT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async (event) => {
  
  // N.B. YOU SHOULD MAKE A _REAL_ APPLICATION WITH ERROR CHECKING
  // AND SOLID DEV PRACTICES. THIS IS A PROOF-OF-CONCEPT.
  //
  // IN OTHER WORDS...DON'T TRY THIS AT HOME!
  // 
  const body = JSON.parse(event.body);
  
  const url = "https://fp.keyri.com/v1/client";
  const ipAddress =  event.requestContext.identity.sourceIp;
  const Service_Encryption_Key = process.env.Service_Encryption_Key;
  const Service_Decryption_Key = process.env.Service_Decryption_Key;
  const API_Key = process.env.API_Key;
  
  const sendBody = {
    ...body, 
    "userId": "undefined",
    "eventType": "visits",
    "metadata": {},
    ipAddress,
    headers: event.headers,
    API_Key,
    Service_Encryption_Key,
    Service_Decryption_Key
  };
  
  let returnData = await fetch(url, {
      method: 'POST', // Method itself
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(sendBody)
  });
  
  let returnDataJson = await returnData.json();

  // Probably want to get fancier here - this'll do for demo purposes:
  let statusCode;
  if(returnDataJson?.riskSummary === "allow"){
    statusCode = 200;
  } else if(returnDataJson?.riskSummary === "warn"){
    statusCode = 302;
    DEFAULT_HEADERS = {...DEFAULT_HEADERS, "Location": "./bicycle_identification_adventure.html"}
  } else {
    statusCode = 400;
    DEFAULT_HEADERS = {...DEFAULT_HEADERS, "Location": "./blocked.html"}
  }
  
  return {
    statusCode,
    body: JSON.stringify(returnDataJson),
    headers: DEFAULT_HEADERS
  };

};

```