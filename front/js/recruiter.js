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
            console.log('session validity: ' + session.isValid());
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
            RowdyruffBoys.signOut();
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

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));