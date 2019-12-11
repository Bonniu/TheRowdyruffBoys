var RowdyruffBoys = window.RowdyruffBoys || {};
RowdyruffBoys.map = RowdyruffBoys.map || {};

var data = { 
		UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity from recruiter.js: ' + session.isValid());
        });
    }
	



(function rideScopeWrapper($) {
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


    $(function onDocReady() {
        $('#signOut').click(function() {
            cognitoUser.signOut();
            alert("You have been signed out.");
			console.log("You have been signed out.");
            window.location = "signin.html";
        });
		$('#showUser').click(function() {
            cognitoUser.getUserAttributes(function(err, result) {
				if (err) {
					alert(err);
					return;
				}
				for (i = 0; i < result.length; i++) {
					console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
					if(i == result.length - 2){
						//alert('Your account status: ' + result[i].getName() + ' has value ' + result[i].getValue());
					}
					if(i == result.length - 1){
						alert('You are logged in on ' + result[i].getName() + ' which has value ' + result[i].getValue());
					}
				}
			});
            //alert(strInfoAccount);
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });
	$('#deleteUser').click(function() {
			var r = confirm("Do you really want to delete Your actual account? \n This operation is not temporary.");
			if(r == true){
				cognitoUser.deleteUser(function(err, result) {
					if (err) {
						alert(err.message || JSON.stringify(err));
						return;
					}
					console.log('call result: ' + result);
					alert("Your account has been deleted . . . ");
					console.log("Your account has been deleted . . . .");
					window.location = "signin.html";
				});
				
			} else {
				//alert("You canceled deleting your account.");
				console.log("You canceled deleting your account.");
			}
            
        });
	
	$('#getAllUsers').click(function() {
			console.log("ShowAllUsers");
			
			let url = "https://1mqghaecbc.execute-api.us-east-1.amazonaws.com/testGetAllUsers/getallusers";

			$.ajax({
				type:"GET",
				url: url,
				data: {      
					'Content-Type': 'application/json',
					'Authorization': RowdyruffBoys.authToken
				  },
				crossDomain: true,
				success: function (data) {
				  console.log("received: " + JSON.stringify(data));
				}});
				
			// $.getJSON(url, function(data) {
				// console.log("received: " + JSON.stringify(data));
			// });
				
			});
			
	$('#createAJAX').click(function() {
			console.log("creating user to DynamoDB by AJAX");
			
			let url = "https://54pvtn3r3g.execute-api.us-east-1.amazonaws.com/witamUser/users";
			
			var text = '{ "userEmail":"John1@gmail.com" , "test_id":"empty", "test_check":"empty" }'; 

			$.ajax({
				headers: { 
					'Authorization': RowdyruffBoys.authToken,
					'Accept': 'application/json',
					'Content-Type': 'application/json' 					
				},
				'type': 'POST',
				'url': url,
				'data': text,
				'dataType': 'json',
				crossDomain: true,
				success: function(resp) { 
					console.log('good --> successfuly added user to DynamoDB');
				},
				error: function(resp, err) { 
					console.log('fail'); 
					console.log(resp); 
					console.log(err);
				}
				});				
			});

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));