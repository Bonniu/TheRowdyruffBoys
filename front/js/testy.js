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

    function getTest() {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                "test_id": 3
            }),
            contentType: 'application/json',
            success: (data) => {
                //console.log(data);
                json = data;
            },
        });
    }


    
}(jQuery));


jQuery(document).ready(function ($) {
    $(".clickable-row").click(function () {
        window.location = $(this).data("href");
    });
});


Survey
        .StylesManager
        .applyTheme("default");

    window.survey = new Survey.Model(json);

    survey
        .onComplete
        .add(function (result) {
            document
                .querySelector('#survey')
                .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
        });

    $("#surveyContainer").Survey({ model: survey });




