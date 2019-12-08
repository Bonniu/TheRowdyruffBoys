var RowdyruffBoys = window.RowdyruffBoys || {};
RowdyruffBoys.map = RowdyruffBoys.map || {};


(function checkIfSignedIn($) {
    var authToken;
    RowdyruffBoys.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = 'signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
}(jQuery));


let url = "https://ix97tx40of.execute-api.us-east-1.amazonaws.com/insertTest/";

var options = {
    showLogicTab: true
};
var creator = new SurveyCreator.SurveyCreator("creatorElement", options);

var survey = new Survey.Model(JSON.parse(creator.text));

//Setting this callback will make visible the "Save" button
creator.saveSurveyFunc = function () {
    $.ajax({
    type:"POST",
    url: url,
    data: {      
        'Content-Type': 'application/json',
        'Authorization': RowdyruffBoys.authToken
      },
    crossDomain: true,
    success: function (data) {
      console.log("Good job XD");
    }});
}

creator.text = "{}";

(function questionAddScopeWrapper($) {
	var authToken;
    RowdyruffBoys.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = 'signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
}(jQuery));