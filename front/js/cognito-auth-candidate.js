

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

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
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

    function handleRegister(event) {
        var email = $('#emailInputRegisterCandidate').val();
        var password = 'trudneHaslo123!'
        var password2 = 'trudneHaslo123!'

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verifyCandidate.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
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
				//możliwe że nie będzie potrebna strona verify tylko od razu LOGIN CANDIDATE wraz ze zmianą hasła
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }
}(jQuery));
