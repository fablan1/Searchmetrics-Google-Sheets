
// wenn API request geamcht wird: prüfen
// token ist da, token ist nicht da, wenn nicht da dann token request setzen...
//
// Berechne neues Datum für Gültigkeit des Token: new Date( new Date().getTime() + 315360000) if if else...


var documentProperties = PropertiesService.getDocumentProperties();



function checkAuth ()
{
    var response = {};
    var searchmetricsToken = documentProperties.getProperty('searchmetricsToken');
    if (searchmetricsToken == "" )
    {
        response.isAuthenticated = false;
    }
    else
    {
     response.isAuthenticated = true;
    }

    return response;
}

function clearAuth ()
{
   documentProperties.setProperty('searchmetricsToken',false);
}


function makeAPIrequest()
{
    var res = getTokenResponse();
    Logger.log("token",res);

    var response = UrlFetchApp.fetch('http://api.searchmetrics.com/v3/ResearchOrganicGetValueSeoVisibilityWorld.json?url=searchmetrics.com', {
        headers: {
            Authorization: 'Bearer ' + res.access_token
        }
    });
    var data = response.getContentText();
    Logger.log("data",data);
}




//Function to get Token from Searchmetrics - returns full Token-Object
function getTokenResponse(apiKey,apiSecret) {
    var headers = {
        'Accept': 'application/json'
    };

    var tokenPayload = {
        //refresh_token: token.refresh_token,
        client_id: apiKey,
        client_secret: apiSecret,
        grant_type: 'client_credentials'
    };

    var response = UrlFetchApp.fetch('http://api.searchmetrics.com/v3/token', {
        method: 'post',
        headers: headers,
        payload: tokenPayload,
        muteHttpExceptions: true
    });


    var token = response.getContentText();
    //Logger.log("token",token);
    if (response.getResponseCode() != 200 || token.error) {

        Logger.log("code",response.getResponseCode(),"err",token.error);

        // zur Validierung ob Client ID // Sectret falsch ist....
        /*var reason = [
         token.error,
         token.message,
         token.error_description,
         token.error_uri
         ].filter(Boolean).map(function(part) {
         return typeof(part) == 'string' ? part : JSON.stringify(part);
         }).join(', ');
         if (!reason) {
         reason = response.getResponseCode() + ': ' + JSON.stringify(token);
         }
         throw 'Error retrieving token: ' + reason;
         }*/

        //return token;
    }
    var tokenObject = JSON.parse(token);
    Logger.log("tokenObject",tokenObject);
    return tokenObject;

}



//Server-Side Function to show Service-Info in Google Spreadsheet
function processForm(data)
{
    // here you can process the data from the form
    //Browser.msgBox(data+"32");
    // Display a modal dialog box with custom HtmlService content.
    var htmlOutput = HtmlService
        .createHtmlOutput('<p>A change of speed, a change of style...</p>')
        .setWidth(250)
        .setHeight(300);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'API Call Info');

    // Display a modal dialog box with custom UiApp content.
    var uiInstance = UiApp.createApplication()
        .setWidth(250)
        .setHeight(300);
    uiInstance.add(uiInstance.createLabel(data));
    SpreadsheetApp.getUi().showModalDialog(uiInstance, 'API Call Info');
}


//Function to get Token from Searchmetrics and Return Status for Front-End UI
function getTokenFromSearchmetrics(apiData)
{
    var apiKey = apiData[0].apiKey;
    var apiSecret = apiData[0].apiSecret;

    var tokenObject = getTokenResponse(apiKey,apiSecret);
    //Logger.log("Tokenobject",tokenObject);

    if(tokenObject.error_message)
    {
        return false;
    }
    else
    {
        searchmetricsToken = tokenObject.access_token;
        documentProperties.setProperty('searchmetricsToken', searchmetricsToken);
        documentProperties.setProperty('apiKey', apiKey);
        documentProperties.setProperty('apiSecret', apiSecret);
        return true;
    }

}


function fireSearchmetricsRequest(fullServiceName,dataFromFields)
{

  var searchmetricsToken = documentProperties.getProperty('searchmetricsToken');
  //Logger.log(searchmetricsToken);
  if (searchmetricsToken !== "" )
  {
  var baseURL ='http://api.searchmetrics.com/v3/'+fullServiceName+'.json?';
  var parameterString ="";


  dataFromFields = dataFromFields.filter(function (a)
  {
     return a.val == '' ? false : true;
  })

  for (var i = 0; i< dataFromFields.length; i++)
  {
    var keyValuePair = dataFromFields[i];
    var key = keyValuePair.key
    var val = keyValuePair.val

   parameterString +=key+"="+val;
   if (i <= dataFromFields.length -2)
   {
   parameterString += "&";
   }

  }
  baseURL +=parameterString;
  baseURL += "&access_token="+searchmetricsToken;
  Logger.log("BASEURL: ", baseURL);


  var params = {
    'method': 'GET',              // This is redundant; GET is default
    'muteHttpExceptions' : true
  };
    var response = UrlFetchApp.fetch(baseURL,params);
      var responseCode = response.getResponseCode();
      Logger.log("RESPONSE CODE: ",responseCode);




         var rc = response.getResponseCode();
         var responseText = response.getContentText();
        Logger.log("getResponseCode",rc);
    if (rc !== 200) { // Log HTTP Error

      Logger.log("responseText",responseText);
      data = JSON.parse(responseText);
      Logger.log("data as String",data);
      showError();
  }
  else {
    // Successful POST, handle response normally
      data = JSON.parse(responseText);
      Logger.log("data as String",data);
      renderData(data);
  }



  }
  else
  {
  Logger.log("Token not set");
  }
}


function showError()
{
 // Display a modal dialog box with custom UiApp content.
 var uiInstance = UiApp.createApplication()
     .setWidth(250)
     .setHeight(300);
 uiInstance.add(uiInstance.createLabel('API failed to deliver data. Please check your Input fields.'));
 SpreadsheetApp.getUi().showModalDialog(uiInstance, 'Request Error');
}
