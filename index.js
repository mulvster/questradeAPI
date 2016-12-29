var request = require('request');

var refresh_token= "8FBYOBSpDrsNhL_vZysVOakamfufZgCV0";

// This gets us the access token for authorizing subsequent requests
console.log("getting access token");
request.get(
  {url:'https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=' + refresh_token},
  function(err, response, body){
    if(err){
      console.log(err);
      return;
    }

    console.log(response.statusCode);

    if(response.statusCode != 200){
      console.log(body); // If we get here, it is likely to be a 'bad request' because we are using the same refresh_token more than once
      return;
    }

    b = JSON.parse(body)
    var access_token = b.access_token;
    var api_server = b.api_server;

    // Let's try to get our account information
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





