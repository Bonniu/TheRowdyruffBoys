

var RowdyruffBoys = window.RowdyruffBoys || {};
RowdyruffBoys.map = RowdyruffBoys.map || {};

let json;

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

let url = "https://0hqj2kdr41.execute-api.us-east-1.amazonaws.com/testTable/testtable";

$.ajax({
    type:"GET",
    url: url,
    data: {      
        'Content-Type': 'application/json',
        'Authorization': RowdyruffBoys.authToken,
        'test_id': 3
      },
    crossDomain: true,
    success: function (data) {
      console.log("received: " + JSON.stringify(data));
      var survey = new Survey.Model(JSON.parse(data));

      survey
          .onComplete
          .add(function (result) {
              document
                  .querySelector('#survey')
                  .innerHTML = "result: " + JSON.stringify(result.data);
          });

      $("#surveyContainer").Survey({model: survey});

    }});



jQuery(document).ready(function ($) {
    $(".clickable-row").click(function () {
        window.location = $(this).data("href");
    });
});


