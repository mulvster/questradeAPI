const prefixArray = ['MMM','ABT','ABBV','ACN','ATVI','AYI','ADBE','AAP','AES','AET','AMG','AFL','A','APD','AKAM','ALK','ALB','AGN','LNT','ALXN','ALLE','ADS','ALL','GOOGL','GOOG','MO','AMZN','AEE','AAL','AEP','AXP','AIG','AMT','AWK','AMP','ABC','AME','AMGN','APH','APC','ADI','ANTM','AON','APA','AIV','AAPL','AMAT','ADM','ARNC','AJG','AIZ','T','ADSK','ADP','AN','AZO','AVB','AVY','BHI','BLL','BAC','BK','BCR','BAX','BBT','BDX','BBBY','BBY','BIIB','BLK','HRB','BA','BWA','BXP','BSX','BMY','AVGO','CHRW','CA','COG','CPB','COF','CAH','HSIC','KMX','CCL','CAT','CBG','CBS','CELG','CNC','CNP','CTL','CERN','CF','SCHW','CHTR','CHK','CVX','CMG','CB','CHD','CI','XEC','CINF','CTAS','CSCO','C','CFG','CTXS','CLX','CME','CMS','COH','KO','CTSH','CL','CMCSA','CMA','CAG','CXO','COP','ED','STZ','GLW','COST','COTY','CCI','CSRA','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DLPH','DAL','XRAY','DVN','DLR','DFS','DISCA','DISCK','DG','DLTR','D','DOV','DOW','DPS','DTE','DD','DUK','DNB','ETFC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMR','ENDP','ETR','EVHC','EOG','EQT','EFX','EQIX','EQR','ESS','EL','ES','EXC','EXPE','EXPD','ESRX','EXR','XOM','FFIV','FB','FAST','FRT','FDX','FIS','FITB','FSLR','FE','FISV','FLIR','FLS','FLR','FMC','FTI','FL','F','FTV','FBHS','BEN','FCX','FTR','GPS','GRMN','GD','GE','GGP','GIS','GM','GPC','GILD','GPN','GS','GT','GWW','HAL','HBI','HOG','HAR','HRS','HIG','HAS','HCA','HCP','HP','HES','HPE','HOLX','HD','HON','HRL','HST','HPQ','HUM','HBAN','IDXX','ITW','ILMN','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IRM','JEC','JBHT','SJM','JNJ','JCI','JPM','JNPR','KSU','K','KEY','KMB','KIM','KMI','KLAC','KSS','KHC','KR','LB','LLL','LH','LRCX','LEG','LEN','LVLT','LUK','LLY','LNC','LLTC','LKQ','LMT','L','LOW','LYB','MTB','MAC','M','MNK','MRO','MPC','MAR','MMC','MLM','MAS','MA','MAT','MKC','MCD','MCK','MJN','MDT','MRK','MET','MTD','KORS','MCHP','MU','MSFT','MAA','MHK','TAP','MDLZ','MON','MNST','MCO','MS','MOS','MSI','MUR','MYL','NDAQ','NOV','NAVI','NTAP','NFLX','NWL','NFX','NEM','NWSA','NWS','NEE','NLSN','NKE','NI','NBL','JWN','NSC','NTRS','NOC','NRG','NUE','NVDA','ORLY','OXY','OMC','OKE','ORCL','PCAR','PH','PDCO','PAYX','PYPL','PNR','PBCT','PEP','PKI','PRGO','PFE','PCG','PM','PSX','PNW','PXD','PBI','PNC','RL','PPG','PPL','PX','PCLN','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RRC','RTN','O','RHT','REGN','RF','RSG','RAI','RHI','ROK','COL','ROP','ROST','RCL','R','CRM','SCG','SLB','SNI','STX','SEE','SRE','SHW','SIG','SPG','SWKS','SLG','SNA','SO','LUV','SWN','SE','SPGI','SWK','SPLS','SBUX','STT','SRCL','SYK','STI','SYMC','SYF','SYY','TROW','TGT','TEL','TGNA','TDC','TSO','TXN','TXT','COO','HSY','TRV','TMO','TIF','TWX','TJX','TMK','TSS','TSCO','TDG','RIG','TRIP','FOXA','FOX','TSN','UDR','ULTA','USB','UA','UAA','UNP','UAL','UNH','UPS','URI','UTX','UHS','UNM','URBN','VFC','VLO','VAR','VTR','VRSN','VRSK','VZ','VRTX','VIAB','V','VNO','VMC','WMT','WBA','DIS','WM','WAT','WEC','WFC','HCN','WDC','WU','WRK','WY','WHR','WFM','WMB','WLTW','WYN','WYNN','XEL','XRX','XLNX','XL','XYL','YHOO','YUM','ZBH','ZION','ZTS'];

const request = require('request');
const access_token = '7pAuNhEAkuHA8KnyWj8u8x9l3aOTdZwD0';
const api_server = "https:\/\/api02.iq.questrade.com\/";
// const refresh_token = "i_4kqAQvDhQjHLCHYJGIDIDmtdGtcQDQ0";

let i = 0;

// want to run the function once
getCodeMeat(prefixArray, 0);
// gives me a new access token
// getAccessToken();

function getAccessToken(prefix) {
  // This gets us the access token for authorizing multiple requests
  console.log("getting access token");
  request.get(
    {url:'https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=' + refresh_token},

  //should probably refactor and modularize since using the same function more than twice.
    function(err, response, body) {
      if(err){
        console.log(err);
        return;
      }

      if(response.statusCode != 200) {
        // If we get here its a bad request... can only use refresh token once.
        console.log(response.statusCode, "code returned, cannot do this.");
      }

      //this is where we request the information we're looking for from questrade API.
      if(response.statusCode === 200)
      {
        console.log(response.statusCode);
        console.log('Make a request');
        let bodyParse = JSON.parse(body);
        let access_token = bodyParse.access_token;
        let api_server = bodyParse.api_server;
        console.log("Access token:", access_token);
        console.log("Api server:", api_server);
      }
    }
  );
}

function getCodeMeat(prefixArray, position) {
  let prefix = prefixArray[position];
  request.get(
    {
       //this returns back internal symbol id to use in other calls and for different stock markets. Must have internal symbolID to access candle data
      url: api_server + 'v1/symbols/search?prefix=' + prefix,
      auth: {
        bearer: access_token
      }
    },
    // callback with the body object
    function(err, response, body) {
      if(err){
        console.log("error", err);
        return;
      }
      if(response.statusCode === 200)
      {
        let bodyParse = JSON.parse(body);
        let firstPrefix = bodyParse.symbols[0].symbol;
        if (prefix !== firstPrefix) {
          console.log('ERROR,', prefix, "doesn't equal", firstPrefix);
        }
        console.log(prefix + "," + bodyParse.symbols[0].symbolId);
      } else {
        console.log("response code:", response.statusCode);
      }
        //recursion it does everything I want it to do for one value and then the very last thing in the code to do is settimeout and then repeat everything again with the next value defined by position 'i', so long as 'i' is less than the length of the list. if I put anything outside of the stack after the settimeout, It will not work.
        
        setTimeout(function() {
          i++;
          if (i < prefixArray.length) {
          getCodeMeat(prefixArray, i);
          }
        }, 50); // 20 times a second
    });
}