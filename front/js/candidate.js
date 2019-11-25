var RowdyruffBoysCandidates = window.RowdyruffBoysCandidates || {};
RowdyruffBoys.map = RowdyruffBoysCandidates.map || {};

var data = { 
		UserPoolId: _config_candidate.cognito.userPoolId,
        ClientId: _config_candidate.cognito.userPoolClientId
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
            window.location.href = 'signinAsCandidate.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signinAsCandidate.html';
    });


    $(function onDocReady() {
        $('#signOut').click(function() {
            cognitoUser.signOut();
            alert("You have been signed out.");
			console.log("You have been signed out.");
            window.location = "signinAsCandidate.html";
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

        if (!_config_candidate.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });
	$('#deleteUser').click(function() {
			var r = confirm("Jesteś pewien że chcesz usunąć to konto? \n (Działa więc nie rób tego XD)");
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

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));