

var RowdyruffBoys = window.RowdyruffBoys || {};
RowdyruffBoys.map = RowdyruffBoys.map || {};


var url_string = this.window.location.href
var url = new URL(url_string);
let ID = url.searchParams.get("a");

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

var options = {
    showLogicTab: true
};
var creator = new SurveyCreator.SurveyCreator("survey", options);

$.ajax({
    type: "GET",
    url: "https://0hqj2kdr41.execute-api.us-east-1.amazonaws.com/testTable/testtable",
    data: {
        'Content-Type': 'application/json',
        'Authorization': RowdyruffBoys.authToken,
        'test_id': ID
    },
    crossDomain: true,
    success: function (data) {
        console.log("received2: " + JSON.stringify(data));
        console.log(ID);

        creator.text = data;
    }
});


creator.saveSurveyFunc = function () {
	console.log('save w edit');

	//add
	let url2 = "https://qqtxipf377.execute-api.us-east-1.amazonaws.com/insertTest/";
	$.ajax({
		
        headers: { 
            'Authorization': RowdyruffBoys.authToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        'type': 'POST',
        'url': url2,
        'data': JSON.stringify(JSON.parse(creator.text)),
        'dataType': 'json',
        success: function(resp) { 
            console.log('on success');
			console.log(resp);
			alert(resp);
        },
        error: function(resp, err) { 
            console.log('fail'); 
            console.log(resp); 
            console.log(err);
        }
	});
	console.log('po add');
	
	//delete
    url2 = "https://0hqj2kdr41.execute-api.us-east-1.amazonaws.com/testTable/deletetest";
    $.ajax({
        type: 'POST',
		data: {
			'Authorization': RowdyruffBoys.authToken,
			'Content-Type': 'application/json' 
		},
        'url': url2,
		'data': ID,
        success: function(resp) { 
            console.log('on success delete');
			console.log(resp);
			alert(resp);
        },
        error: function(resp, err) { 
            console.log('fail'); 
            console.log(resp); 
            console.log(err);
        }
	});
	redirectToTesty();
	
};

async function redirectToTesty() {
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	await sleep(3000);
	window.location.href = 'testy.html';
}


