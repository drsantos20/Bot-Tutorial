const API_AI_TOKEN = 'f9b0dcc985594d389e90572ee6bbdd2c';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAACMUdtAws8BALf4hfuZB9KNeCH6FxwaqUQl0LlnoivWDAvUZCZCuiSug0lpGDbQBepXIUHPZA6MjMpSZCSfuLdsLmzYI4d9OarUZB4N6YOkOc4eZATlz6HLNYmQmaqVyWIuhoTfZBZAZCqmTfZC6fmiLZCcbs3GHBGKZBYi3Im9eieYzZAwZDZD';
const request = require('request');
const sendTextMessage = (sender_psid, response) => {
    console.log('Sender PSID: ' + sender_psid);
    console.log('message: ' + response);
    let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": {
            "text": response
        }
      }

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": FACEBOOK_ACCESS_TOKEN },
        "method": 'POST',
        "json":  request_body
      }, (err, res, body) => {
        console.log(res.statusCode + " " +  JSON.stringify(res))
        if (!err && res.statusCode == 200) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
};
module.exports = (event) => {
    console.log('crowdbotics_bot')
    const sender_psid = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, { sessionId: 'crowdbotics_bot' });
    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(sender_psid, result);
        console.log(response)
    });
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};