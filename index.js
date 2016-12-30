require('dotenv').config()

const request = require('request');


// This gets us the access token for authorizing multiple requests
console.log("getting access token");
request.get(
  {url:'https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=' + process.env.refresh_token},
  
//should probably refactor and modularize since using the same function more than twice.
  function(err, response, body){
    if(err){
      console.log(err);
      return;
    }

    console.log(response.statusCode);

    if(response.statusCode != 200) {
      console.log(body); 
      // If we get here, it is likely to be a 'bad request' because we are using the same refresh_token more than once
      return;
    }

    let b = JSON.parse(body)
    let access_token = b.access_token;
    let api_server = b.api_server;

    //this is where we request the information we're looking for from questrade API.
    if(response.statusCode == 200)
    {
      console.log('Make a request');
      request.get(
        {
          url: api_server + 'v1/markets/quotes/8049',
          auth:{
            bearer : access_token
          }
        },
        function(err, response, body){
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





