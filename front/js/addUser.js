var RowdyruffBoys = window.RowdyruffBoys || {};
RowdyruffBoys.map = RowdyruffBoys.map || {};

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:10db05a2-5aca-41b9-adb3-e82ab15c5d2f'
});

//AWS.config.update({ region: 'us-east-1', accessKeyId: 'ASIA6PCH5ICRF3YHSI2Z', secretAccessKey: '9UMxG0OANneFPBNw3QC4vingH6AqMWKBEP5rwVHr' });

// AWS.config.region = 'us-east-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // IdentityPoolId: 'us-east-1:3ce33b07-c3d7-40c7-b670-1b499c875b4c',
// });

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

(function adminCreateUserScopeWrapper($) {
	//alert(AWS.config.credentials.toString())
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
			$('#adminCreateUser').submit(handleCreateUser);
		});

	function handleCreateUser(event) {
		var email = $('#PrzykladowyAdres').val();
		
		
		var params = {
		UserPoolId: 'us-east-1_TCh6JGTLn', /* required */
		Username: email, /* required */
		DesiredDeliveryMediums: ["EMAIL"],
		UserAttributes: [
				{
					Name: 'email', /* required */
					Value: email
				}
			]
		};

		cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else     console.log(data);           // successful response
		});
		alert(email)
	}

}(jQuery));