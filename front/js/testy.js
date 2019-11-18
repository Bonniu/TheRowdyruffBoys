

var RowdyruffBoys = window.RowdyruffBoys || {};
RowdyruffBoys.map = RowdyruffBoys.map || {};

let json = {

};

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

let data = {
    "test_id": 3
}

let headers = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': RowdyruffBoys.authToken
    }
}

axios.get(url, { params: { "test_id": 3 }}, headers)
.then(function (response) {
    json = response
})
.catch(function (error) {
    console.log("dupa");
})




jQuery(document).ready(function ($) {
    $(".clickable-row").click(function () {
        window.location = $(this).data("href");
    });
});


Survey
    .StylesManager
    .applyTheme("default");

window.survey = new Survey.Model(json.data);

survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#survey')
            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    });

$("#surveyContainer").Survey({ model: survey });




