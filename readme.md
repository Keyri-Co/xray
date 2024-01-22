# Keyri XRAY:
### Fewer Captchas. Lower Bounce Rate. Increase Revenue. Decrease Fraud. 

Keyri X-RAY can substantially reduce your app's surface area for fraud without sacraficing user experience. 

# Client Side

## Installation
Pretty standard here, you can either use NPM / Yarn if you're compiling the code, or pull from the CDN of your choice.

```bash
npm i @keyri/xray --save
```

\- or - 

```html
<!-- Adding library from NPM via UNPKG -->
<script type="module" >

    // Pull Library from CDN
    import {XRAY} from 'https://unpkg.com/@keyri/xray/index.mjs';

</script>
```

## Running It
Import the library. Instantiate it. Call the `scan` method.:

```javascript
const _xray = new XRAY();    // Instantiate the wrapper class
await _xray.load();          // Load the library into memory
const xray = _xray.xray;     // `.xray` is the actual worker here

// * Perform Local Analysis Of The User's Client * //
const encrypted_fraud_data = await xray.scan({"apiUrl": "local"});

```

## Now What?

Forward this data to your server...and from there to our API for processing and analysis:

You can forward this information to your server via form submission, as a standalone XHR Request, through a websocket tunnel, webRTC - whatever. 

```json
{
    "encryptedB64Payload": "eyJjbGllbnRFbmNyeX...U4UmVJK09wOHc9PSJ9"
}
```

# Server Side

## Installation
None Required! 

Seriously. You'll make a REST request as a JSON with some `.env` variables.

Bonus! We're not a [Supply Chain Attack](https://en.wikipedia.org/wiki/Supply_chain_attack#Examples) - vector!

## Running It

Build a JSON Payload. Make a REST-POST. That's it!

```javascript

  const url = "https://fp.keyri.com/v1/client";

  // 1.) Create A Payload Object to send to our API
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
  
  // 2.) Send the Data, Get a Response.
  let returnData = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(sendBody)
  });
  
  let returnDataJson = await returnData.json();


```



## Decrypted Object

* `riskSummary`: Represents the result of the event, depending on your risk tolerance settings. Possible values are "warn", "allow", "deny".

* `ipAddress`: The IP address of the client.

* `ipLocationData`: city, region, country, and time zone based on ip-address

* `userId`: The ID of the user in your system, usually their email address. Validate this value to ensure its accuracy.

* `deviceId`: A unique ID we've assigned to the client's device.

* `wagId`: A combination of the user's screen size and IP address. Useful when you want to block a specific user on public Wi-Fi, rather than blocking an entire IP address.

* `signals`: An array that lists suspicious signals detected during the session, e.g., "max_events_per_timeframe".

* `trustScore`: A score between 0 and 1, based on browser metrics, behavioral analytics, and Bayesian machine learning. A higher score indicates a "good" user.

* `changes`: An array of changes being made to the user or the device. For example, when a new country is added, or a new IP is registered, these changes will be recorded here.

* `event_type`: The type of event logged, like "login", "signup", etc.

* `deviceAge`: The age of the device ID for YOUR service in hours. Since misbehaving device IDs can be blocked, older device IDs are generally more trustworthy.

* `globalDeviceAge`: The age of the device ID for ANY service in hours.

* `timestamp`: Timestamp of the assessment provided by the API

* `clientPublicSignatureKey`: Public Signature Key of the Client-Device. Should be used to verify signature of `Encrypted-Object`

* `instance`: Everything available to the rules engine for processing.

Here's a typical decrypted response:

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
