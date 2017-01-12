require('dotenv').config()

const request = require('request');

// This gets us the access token for authorizing multiple requests
console.log("getting access token");
request.get(
  {url:'https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=' + process.env.refresh_token},
  
//should probably refactor and modularize since using the same function more than twice.
  function(err, response, body) {
    if(err){
      console.log(err);
      return;
    }

    console.log(response.statusCode);

    if(response.statusCode != 200) {
      // If we get here its a bad request... can only use refresh token once.
      return;
    }

    let bodyParse = JSON.parse(body)
    let access_token = bodyParse.access_token;
    let api_server = bodyParse.api_server;

    //this is where we request the information we're looking for from questrade API.
    if(response.statusCode === 200)
    {
      console.log('Make a request');
      request.get(
        {
           //this returns back internal symbol id to use in other calls and for different stock markets. Must have internal symbolID to access candle data

           //v1/markets/candles/9292?startTime=2017-01-04T00:00:00-05:00&endTime=2017-01-04T23:59:59-05:00&interval=OneDay
          url: api_server + 'v1/symbols/search?prefix=BMO', 
         
          auth:{
            bearer : access_token
          }
        },
        function(err, response, body) {
          if(err){
            console.log(err);
            return;
          }
          console.log(response.statusCode);
          console.log(body);
        }
      );
    }
  }
);





