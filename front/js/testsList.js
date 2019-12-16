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
            console.log((i));
        }

		for (let test of testsList) {
			table.append(
				"<tr>" +
				"<td>" + test + "</td>" +
				"<td>" + "<button onclick='editTest(" + test + ")'>Edit</button>" + "</td>" +
				"<td>" + "<button onclick='assignCandidateMethod(" + test + ")'>assignCandidate</button>" + "</td>" +
				
				
				"</tr>"
			);
		}
    }
});

function editTest(test) {
	console.log(test);
    window.location = 'example_test.html?a=' + test;
}

function assignCandidateMethod(test){
	//
	  var txt;
  var person = prompt("Please enter your email:", "adres email");

	//
				 var email = $('#emailInputToAssignCandidate').val();
				var test_id = $('#testIdInputToAssignCandidate').val();
						url = "https://54pvtn3r3g.execute-api.us-east-1.amazonaws.com/witamUser/users";
						var text = '{ "userEmail":"' + person + '", "test_id":"' + test + '" }';  
						$.ajax({
							headers: { 
								'Authorization': RowdyruffBoys.authToken,
								'Accept': 'application/json',
								'Content-Type': 'application/json' 					
							},
							'type': 'PUT',
							'url': url,
							'data': text,
							'dataType': 'json',
							crossDomain: true,
							success: function(resp) { 
							console.log('good --> successfuly assignedCandidateToTest to DynamoDB');
							},
							error: function(resp, err) { 
								console.log('fail assignedCandidateToTest to DynamoDB');  
								console.log(resp); 
								console.log(err);
							}
							});		
			}






