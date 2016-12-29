var https = require('https');
var queryString = require('querystring');
var q = require('q');
var util = require('util');
var url = require('url');

/* Constants */
var PRACTICE_LOGIN_HOST = 'practicelogin.questrade.com';
var LOGIN_HOST = 'login.questrade.com';
var LOGIN_PATH = '/oauth2/token';
var GRANT_TYPE = 'refresh_token';
var API_VERSION = '/v1/';

var HTTP_GET = 'GET';
var HTTP_POST = 'POST';

function QuestradeAPI (refreshToken, isPractice) {
  var _self = this;
  var tokenPromise;

  _self.refreshToken = refreshToken;
  _self.accessToken = false;
  _self.apiServer = false;
  _self.tokenType = false;

  function _doRequest(method, data, requestOptions) {
    var deferred = q.defer();

    data = data ? queryString.stringify(data) : false;

    requestOptions = requestOptions || {};
    requestOptions.method = method;

    if (method === HTTP_GET && data) {
      requestOptions.path += '?' + data;
    }

    httpRequest = https.request(requestOptions, function(response) {
      response.on('data', function(data) {
        try {
          data = JSON.parse(data.toString());
          deferred.resolve(data);
        } catch(error) {
          deferred.reject({
            error: 'Error to try parse response',
            data: data
          });
        }
      });
    });

    httpRequest.on('error', function(error) {
      console.error( error );
      deferred.reject(error);
    });

    if (method === HTTP_POST && data) {
      httpRequest.write(data);
    }

    httpRequest.end();

    return deferred.promise;
  }


  function _doAuthenticatedRequest(method, apiCall, data, requestOptions) {
    return _refreshToken().then(function() {
      var defaultRequestOptions = { 
        host: _self.apiServer.host,
        headers: { 
          Authorization:  _self.tokenType + ' ' + _self.accessToken 
        },
        path: API_VERSION + apiCall
      };

      requestOptions = util._extend(defaultRequestOptions, requestOptions || {});

      return _doRequest(method, data, requestOptions);
    });
  }

  /* Private Methods */
  function _refreshToken(forceRefresh) {
    var postData, requestOptions;

    if (!tokenPromise || forceRefresh) {
      postData = {
        grant_type: GRANT_TYPE,
        refresh_token: _self.refreshToken
      }

      requestOptions = {
        host: isPractice ? PRACTICE_LOGIN_HOST : LOGIN_HOST,
        path: LOGIN_PATH
      };

      tokenPromise = _doRequest(HTTP_GET, postData, requestOptions).then(function(accessInfo) {
        _self.refreshToken = accessInfo.refresh_token;
        _self.accessToken = accessInfo.access_token;
        _self.apiServer = url.parse(accessInfo.api_server);
        _self.tokenType = accessInfo.token_type;

        return accessInfo
      });
    }

    return tokenPromise;
  }

  _self.getAccounts = function() {
    return _doAuthenticatedRequest(HTTP_GET, 'accounts').then(function(response) {
      var accounts = response.accounts;
      var i;

      for (i = 0; i < accounts.length; i++) {
        accounts[i].$getPositions = _self.getAccountPositions.bind(_self, accounts[i].number);
        accounts[i].$getBalances  = _self.getAccountBalances.bind(_self, accounts[i].number);
        accounts[i].$getOrders    = _self.getAccountOrders.bind(_self, accounts[i].number);
      }

      return accounts;
    });
  }

  _self.getAccountPositions = function(accountNumber) {
    return _doAuthenticatedRequest(HTTP_GET, 'accounts/' + accountNumber + '/positions').then(function(response) {
      return response.positions
    });
  }

  _self.getAccountBalances = function(accountNumber) {
    return _doAuthenticatedRequest(HTTP_GET, 'accounts/' + accountNumber + '/balances');
  }

  _self.getAccountOrders = function(accountNumber) {
    return _doAuthenticatedRequest(HTTP_GET, 'accounts/' + accountNumber + '/orders').then(function(response) {
      return response.orders;
    });
  }

  _self.getAcessToken = _refreshToken;

  _self.get  = _doRequest.bind(_self, HTTP_GET);
  _self.post = _doRequest.bind(_self, HTTP_POST);
};

module.exports = exports = QuestradeAPI;