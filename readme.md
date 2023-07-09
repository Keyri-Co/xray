# Keyri XRAY:
## _Fewer Captchas. Happier Users. Less Fraud._

Keyri X-RAY can substantially reduce your app's surface area for fraud without sacraficing user experience. 

# Installation

```bash
npm i @keyri/xray --save
```

# Getting Started

Import the library. Instantiate it. Call the `scan` method.:

```javascript
// Import the library
import { XRAY } from "@keyri/xray";

// Instantiate the library to load into shadow-dom
const xray = new XRAY();

// Call the method with your eventType, userId, and your publicKey
let info = await xray.scan(
    data.eventType, // The type of event: Login, Signup, Visits, Access
    data.userId, // The id of the user in your system
    data.yourPublicEcdhKey, // This comes from our dashboard and is used
                            // -- to identify you and as an encryption key
    5_000,  // Optional Timeout. 
            // -- If nothing happens before this, an error is returned 
    "safe"  // Optional Commit-Mode. When used, the API does not
            // -- automatically update information about the device or user.
            // -- The Relying-Party (you) must make an additional API
            // -- call to make this happen. 
);

// Do something useful with the data
console.log({info});

```



# What Does It Return?

The `scan` method returns an encrypted JavaScript object that contains information about the user's activity and device. Here's a breakdown of the properties you'll find in this object:

## Encrypted Object

The return data is HKDF Encrypted. The return object gives you everything you need to decrypt it. Additionally, it provides 2 signatures for you to verify the authenticity of the message if you want to (you want to)

* `ciphertext`: base64 encoded, encrypted response object from the API that was encrypted with the publicKey you provided in the `scan` method

* `iv`: base64 encoded initialization vector

* `salt`: base64 encoded salt

* `publicEncryptionKey`: public key used by the API to encrypt the data

* `apiCiphertextSignature`: The signature by the API of the `ciphertext`. The API's public signature key is: `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEZ+MDV5IhqMBjWVls9NxsXx6h3S9FuqE+BsWS3i2cbjVH3dchhNQNvrzXA2EZ+FvllK+7GO2woKocAoSss/1hmw==`

* `clientCiphertextSignature`: The signature by the browser of the `ciphertext`. The public key is available in the Decrypted-Object.

Here's a typical encrypted object:

```json
{
    "ciphertext": "GpRLvVKkG0...ypZujlupDmN3lNY=",
    "salt": "4UAE...Wt4oL4A==",
    "iv": "jhx...TKL9w==",
    "publicEncryptionKey": "MFkwEwYHKoZIzj0CA...vaUJEgw==",
    "apiCiphertextSignature": "YYNpUBWkS0nlmr8A9q...v9XaQ==",
    "clientCipertextSignature": "e4OFmenmN+...9/Mtys3kGpp6CYA=="
}
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

* `clientRequest`: If you set `Commit-Mode` to "safe", you will have to make a POST request with it to the following end-point: `https://fp.keyri.com/v1/client/`

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
    "clientPublicSignatureKey": "MFkwEwYHKoZ...7VGcI7aNHIvQ==",
    "clientRequest": "eyJjaXBoZXJ0ZXh0IjoiV...Zz09In0="
}
```

## Can It Go Faster?

Yes!

## How Do I Make It Faster?

The most time consuming thing we do is IP analysis, which combines third party data with machine learning. We temporarily cache that data.

If you run the `scan` method immediately after page-load with a `visits` event-type and an `"undefined"` (note the string) user; the next time the method is run it should be about 5x faster!  