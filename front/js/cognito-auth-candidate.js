

var RowdyruffBoys = window.RowdyruffBoysCandidates || {};

(function scopeWrapper($) {
    var signinUrl = 'signinAsCandidate.html';

    var poolData = {
        UserPoolId: _config_candidate.cognito.userPoolId,
        ClientId: _config_candidate.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config_candidate.cognito.userPoolId &&
          _config_candidate.cognito.userPoolClientId &&
          _config_candidate.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config_candidate.cognito.region;
    }

    RowdyruffBoys.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    RowdyruffBoys.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });


    /*
     * Cognito User Pool functions
     */

    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
					
					
					
                } else {
                    onFailure(err);
                }
            }
        );
    }
	
	var cognitoUserForDelete;

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        cognitoUserForDelete = createCognitoUser(email);
        cognitoUserForDelete.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#signinFormCandidate').submit(handleSignin);
        $('#registrationFormForCandidate').submit(handleRegister);
        $('#verifyFormCandidate').submit(handleVerify);
		$('#deleteFormForCandidate').submit(handleSigninDelete);
    });

    function handleSignin(event) {
        var email = $('#emailInputSigninCandidate').val();
        var password = $('#passwordInputSigninCandidate').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('Successfully Logged In');
				alert('Successfully Logged In on ' + email);
                window.location.href = 'candidate.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }
	
	function handleSigninDelete(event) {
        var email = $('#emailInputDeleteCandidate').val();
        var password = $('#passwordInputDeleteCandidate').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('Successfully Authenticate on ' + email);
				
				var r = confirm("Jesteś pewien że chcesz usunąć to konto? \n (Działa więc nie rób tego XD)");
				if(r == true){
					cognitoUserForDelete.deleteUser(function(err, result) {
						if (err) {
							alert(err.message || JSON.stringify(err));
							return;
						}
						console.log('call result: ' + result);
						
						console.log(email + " account has been deleted . . . ");
						
						//AJAX DELETE
						console.log("Deleting user from DynamoDB by AJAX");
			
						let url = "https://54pvtn3r3g.execute-api.us-east-1.amazonaws.com/witamUser/users";
						var text = '{ "userEmail":"' + email + '" }'; 
						$.ajax({
							headers: { 
								'Authorization': RowdyruffBoys.authToken,
								'Accept': 'application/json',
								'Content-Type': 'application/json' 					
							},
							'type': 'DELETE',
							'url': url,
							'data': text,
							'dataType': 'json',
							crossDomain: true,
							success: function(resp) { 
								console.log('good --> successfuly deleted user from DynamoDB');
							},
							error: function(resp, err) { 
								console.log('fail deleteUser DynamoDB'); 
								console.log(resp); 
								console.log(err);
							}
							});
							
						alert(email + " account has been deleted . . . ");
						
					});
					
					
					
				} else {
					console.log("You canceled deleting " + email + " account.");
				}
				
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function handleRegister(event) {
        var email = $('#emailInputRegisterCandidate').val();
        var password = $('#passwordInputRegisterCandidate').val();
        var password2 = $('#password2InputRegisterCandidate').val();
		var recruiter_email = $('#yourRecruiterMail').val();
		
		var list_emails = [email, recruiter_email];

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
			
			//WYSŁANIE MAILA Z PEP AWS na mail kandydata
			
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
				function sleep(delay) {
					var start = new Date().getTime();
					while (new Date().getTime() < start + delay);
				}
				alert("Good job!!! You have just created a new candidate account.");
				//sleep(3000);
                //window.location.href = 'verifyCandidate.html';
				window.location.href = 'recruiter.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
			Email.send({
				Host: "smtp.gmail.com",
				Username : "test.case.test.case.test@gmail.com",
				Password : "trudneHaslo123!",
				To : list_emails,
				From : "test.case.test.case.test@gmail.com",
				Subject : "Hello from AWS Cognito - Your login and password.",
				Body : "Your email: " + email + " Your password: " + password,
			})
			.then(function(message){
				console.log("mail sent successfully to " + list_emails[0] + " & " + list_emails[1] + ".");
			});
			
			console.log("creating user to DynamoDB by AJAX");
			
					let url = "https://54pvtn3r3g.execute-api.us-east-1.amazonaws.com/witamUser/users";
					var text = '{ "userEmail":"' + email + '", "test_id":"empty", "test_check":"empty" }'; 
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
        } else {
            alert('Passwords do not match');
        }
    }

    function handleVerify(event) {
        var email = $('#emailInputVerifyCandidate').val();
        var code = $('#codeInputVerifyCandidate').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                alert('Verification successful. You will now be redirected to the login page.');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }
}(jQuery));
