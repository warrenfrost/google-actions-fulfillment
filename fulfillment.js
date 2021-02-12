"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var smarthome = require('actions-on-google').smarthome;
var express = require('express');
var bodyParser = require('body-parser');
var app = smarthome();
var ledState = false;
var tokenResponse = {
    "token_type": "Bearer",
    "access_token": "12345678",
    "refresh_token": "87654321",
    "expires_in": 3600
};
var syncResponse = {
    "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
    "payload": {
        "agentUserId": "warren",
        "devices": [
            {
                "id": "1",
                "type": "action.devices.types.LIGHT",
                "traits": [
                    "action.devices.traits.OnOff"
                ],
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
                "roomHint": "office"
            }
        ]
    }
};
var queryResponse = {
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
                "status": "SUCCESS"
            }
        ]
    }
};
/** SYNC Intent Handler */
app.onSync(function (body, headers) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        console.log("SYNC");
        console.log("Request : " + JSON.stringify(body));
        result = getSyncResponse();
        console.log("Response : " + JSON.stringify(result));
        return [2 /*return*/, result];
    });
}); });
/** QUERY Intent Handler */
app.onQuery(function (body, headers) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        console.log("QUERY");
        console.log("Request : " + JSON.stringify(body));
        result = getQueryResponse();
        console.log("Response : " + JSON.stringify(result));
        return [2 /*return*/, result];
    });
}); });
/** EXECUTE Intent Handler */
app.onExecute(function (body, headers) { return __awaiter(void 0, void 0, void 0, function () {
    var device, result;
    return __generator(this, function (_a) {
        console.log("EXECUTE");
        console.log("Request : " + JSON.stringify(body));
        ledState = !ledState;
        device = { on: ledState, online: true };
        queryResponse.payload.devices["1"] = device;
        result = getExecuteResponse();
        console.log("Response : " + JSON.stringify(result));
        return [2 /*return*/, result];
    });
}); });
/** DISCONNECT Intent Handler */
app.onDisconnect(function (body, headers) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        console.log("DISCONNECT");
        console.log("Request : " + JSON.stringify(body));
        result = getDisconnectResponse();
        console.log("Response : " + JSON.stringify(result));
        return [2 /*return*/, result];
    });
}); });
var expressApp = express().use(bodyParser.json());
expressApp.post('/fulfillment', app);
expressApp.post('/access_token', function (req, res) {
    console.log("access_token");
    res.send(tokenResponse);
});
expressApp.get('/authorize', function (req, res) {
    console.log("authorize");
    res.redirect('https://oauth-redirect.googleusercontent.com/r/applebum-91112?code=12345678&state=' + req.query.state);
});
function getSyncResponse() {
    return syncResponse;
}
function getQueryResponse() {
    return queryResponse;
}
// function getExecuteResponse() : SmartHomeV1ExecuteResponse {
function getExecuteResponse() {
    return executeResponse;
}
function getDisconnectResponse() {
    return {};
}
expressApp.listen(3000);
