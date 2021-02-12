import { SmartHomeV1DisconnectResponse, SmartHomeV1ExecuteRequest, SmartHomeV1ExecuteResponse, SmartHomeV1QueryPayload, SmartHomeV1QueryResponse, SmartHomeV1SyncResponse } from "actions-on-google";
import { ApiClientObjectMap } from "actions-on-google/dist/common";
import { stringify } from "qs";

const { smarthome } = require('actions-on-google');
const express = require('express')
const bodyParser = require('body-parser')

const app = smarthome();

var ledState = false;

var tokenResponse = {
  "token_type": "Bearer",
  "access_token": "12345678",
  "refresh_token": "87654321",
  "expires_in": 3600
};

var syncResponse =
{
  "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
  "payload": {
    "agentUserId": "warren",
    "devices": [
      {
        "id": "1",
        "type": "action.devices.types.LIGHT",
        "traits": [
          "action.devices.traits.OnOff"        ],
        "name": {
          "defaultNames": [
            "LED"
          ],
          "name": "LED",
          "nicknames": [
            "LED"
          ]
        },
        "willReportState": false,
        "roomHint": "office"      }
    ]
  }
};

var queryResponse =
{
  "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
  "payload": {
    "devices": {
      "1": {
        "on": ledState,
        "online": true
      }
    }
  }
};

var executeResponse = {
  "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
  "payload": {
    "commands": [
      {
        "ids": [
          "1"
        ],
        "status": "SUCCESS",
      }
    ]
  }
};

/** SYNC Intent Handler */
app.onSync(async (body, headers) => {
  console.log("SYNC");
  console.log("Request : " + JSON.stringify(body));
  var result = getSyncResponse();
  result.requestId = body.requestId;
  console.log("Response : " + JSON.stringify(result));
  return result;
});

/** QUERY Intent Handler */
app.onQuery(async (body, headers) => {
    console.log("QUERY");
    console.log("Request : " + JSON.stringify(body));
    var result = getQueryResponse();
    result.requestId = body.requestId;
    console.log("Response : " + JSON.stringify(result));
    return result;
  });

/** EXECUTE Intent Handler */
app.onExecute(async (body, headers) => {
  console.log("EXECUTE");
  console.log("Request : " + JSON.stringify(body));

  ledState = !ledState;
  var device = {on: ledState, online: true};
  queryResponse.payload.devices["1"] = device;
  var result = getExecuteResponse();
  result.requestId = body.requestId;
  console.log("Response : " + JSON.stringify(result));
  return result;
});

/** DISCONNECT Intent Handler */
app.onDisconnect(async (body, headers) => {
    console.log("DISCONNECT");
    console.log("Request : " + JSON.stringify(body));
    var result = getDisconnectResponse();
    console.log("Response : " + JSON.stringify(result));
    return result;
});

const expressApp = express().use(bodyParser.json())

expressApp.post('/fulfillment', app)

expressApp.post('/access_token', (req, res) => { 
  console.log("access_token");
  res.send(tokenResponse) 
});

expressApp.get('/authorize', (req, res) => { 
  console.log("authorize");
  res.redirect('https://oauth-redirect.googleusercontent.com/r/applebum-91112?code=12345678&state=' + req.query.state);
});

function getSyncResponse() : SmartHomeV1SyncResponse {
  return syncResponse;
}

function getQueryResponse() : SmartHomeV1QueryResponse {
  return queryResponse;
}

// function getExecuteResponse() : SmartHomeV1ExecuteResponse {
function getExecuteResponse() {
  return executeResponse;
}

function getDisconnectResponse() : SmartHomeV1DisconnectResponse {
  return {};
}

expressApp.listen(3000)