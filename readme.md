# Keyri XRAY:
## _Fewer Captchas. Happier Users. Less Fraud._

Keyri X-RAY can substantially reduce your app's surface area for fraud without sacraficing user experience. 

## Installation

```bash
npm i @keyri/xray --save
```

## Getting Started

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
    data.yourPublicEcdhKey, // This comes from our dashboard and is used to identify you and as an encryption key
    5_000  // Optional Timeout. If nothing happens before this, an error is returned 
);

// Do something useful with the data
console.log({info});

```

## Can It Go Faster?

Yes!

## How Do I Make It Faster?

The most time consuming thing we do is IP analysis, which combines third party data with machine learning. We temporarily cache that data.

If you run the `scan` method immediately after page-load with a `visits` event-type and an `"undefined"` (note the string) user; the next time the method is run it should be about 5x faster!  

## What Does It Return?

The `scan` method returns an encrypted JavaScript object that contains information about the user's activity and device. Here's a breakdown of the properties you'll find in this object:

* `riskSummary`: Represents the result of the event, depending on your risk tolerance settings. Possible values are "warn", "allow", "deny".

* `ipAddress`: The IP address of the client.

* `userId`: The ID of the user in your system, usually their email address. Validate this value to ensure its accuracy.

* `deviceId`: A unique ID we've assigned to the client's device.

* `wagId`: A combination of the user's screen size and IP address. Useful when you want to block a specific user on public Wi-Fi, rather than blocking an entire IP address.

* `signals`: An array that lists suspicious signals detected during the session, e.g., "max_events_per_timeframe".

* `trustScore`: A score between 0 and 1, based on browser metrics, behavioral analytics, and Bayesian machine learning. A higher score indicates a "good" user.

* `changes`: An array of changes being made to the user or the device. For example, when a new country is added, or a new IP is registered, these changes will be recorded here.

* `event_type`: The type of event logged, like "login", "signup", etc.

* `deviceAge`: The age of the device ID for YOUR service in hours. Since misbehaving device IDs can be blocked, older device IDs are generally more trustworthy.

* `globalDeviceAge`: The age of the device ID for ANY service in hours.

Here's a typical decrypted response:

```javascript
{
  "state": "warn",
  "ipAddress": "6.6.6.6",
  "userId": "evil@evil.com",
  "deviceId": "399c6617-6b9b-4c45-a9fb-6b827cf845c5",
  "wagId": "BxZQPgacdjFm6lKADc3F72Pb5o0=",
  "signals": [
    "max_events_per_timeframe"
  ],
  "trustScore": 0.0750399185765636,
  "changes": [
    {"type": "new_country", "value": "Antarctica"}
  ],
  "event_type": "login",
  "deviceAge": 0.0242025
}

```
