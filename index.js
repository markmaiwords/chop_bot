var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var app = express();

var port = process.env.PORT || 5000;

    server.listen(port, function () {
        console.log('Updated : Server listening at port %d', port);
    });

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    console.log("Verified webhook");
    res.send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.send('Error, wrong token');
  }
});

// Spin up the Server
app.listen(app.get('port', function() {
    console.log('running on port', app.get('port'))
}));

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
});

var token = "EAAO4ltKkADUBADk5zNhzPV8QZBVezODFaQRDW8q5BN4IHFihkN8y4XAKvzqLRZCTrMfase7O2Wwx6okIZBXZBElkpia4VXZBZALKMXf8uttokpkjV1AwMazS6JgbcgJWP5SQcucytdDVODdzdTRo2U0ZBlcFxoj3DIZD"

// Function to echo back messages
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}