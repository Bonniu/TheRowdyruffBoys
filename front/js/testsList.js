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

let url = "https://oivvvj5ut8.execute-api.us-east-1.amazonaws.com/getTestsID/";

var testsList = [];

$.ajax({
    type: "GET",
    url: url,
    data: {
        'Content-Type': 'application/json',
        'Authorization': RowdyruffBoys.authToken,
    },
    crossDomain: true,
    success: function (data) {

        console.log("received: " + JSON.stringify(data));
        data = data.replace('[', '');
        data = data.replace(']', '');
        data = data.replace(/\s/g, '');

        testsList = data.split(',');

        let table = $("#IDs").find("tbody");

        for (let i of testsList) {
            console.log(typeof (i));
        }

for (let test of testsList) {
    table.append(
        "<tr>" +
        "<td>" + test + "</td>" +
        "<td>" + "<button onclick='editTest(" + test + ")'>Edit</button>" + "</td>" +
        "</tr>"
    );
}
    }
});

function editTest(test) {
    window.location = 'example_test.html?a=' + test;
}






