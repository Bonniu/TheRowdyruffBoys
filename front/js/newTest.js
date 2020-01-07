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


let url = "https://qqtxipf377.execute-api.us-east-1.amazonaws.com/insertTest/";
//arn:aws:lambda:us-east-1:994435743906:function:insertTestIntoDB
var options = {
    showLogicTab: true
};
var creator = new SurveyCreator.SurveyCreator("creatorElement", options);
var txt = ""; //tu bedzie przechowywany caly test przetlumaczony

//Setting this callback will make visible the "Save" button
creator.saveSurveyFunc = function () {
    $.ajax({
        headers: { 
            'Authorization': RowdyruffBoys.authToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        'type': 'POST',
        'url': url,
        'data': JSON.stringify(JSON.parse(creator.text)),
        'dataType': 'json',
        success: function(resp) { 
            console.log('on success');
			alert(resp);
			window.location.href = 'testy.html';
        },
        error: function(resp, err) { 
            console.log('fail'); 
            console.log(resp); 
            console.log(err);
        }
        });
		
		//foreach po kazdej "pages"
		//w srodku foreach po kazdym "title" i wywolanie getTranslatorEN_PL()
		//sprawdzamy czy "type":"text" czy "type":"radiogroup"
		//jezeli "text" to tlumaczymy tylko "title"
		//jezeli "radiogroup" to tlumaczymy "title" oraz tablice "choices"
		txt = JSON.parse(creator.text);
		if(text != null) {
			for( let i = 0; i < txt.pages.length; i++) {
				for( let j = 0; j < txt.pages[i].elements.length; j++) {
					if(txt.pages[i].elements[j].type == "text") {
						txt.pages[i].elements[j].title = getTranslatorEN_PL(txt.pages[i].elements[j].title);
					} else if(txt.pages[i].elements[j].type == "radiogroup") {
						txt.pages[i].elements[j].title = getTranslatorEN_PL(txt.pages[i].elements[j].title);
						for(let t = 0; t < txt.pages[i].elements[j].choices.length; t++) {
							txt.pages[i].elements[j].choices[t] = getTranslatorEN_PL(txt.pages[i].elements[j].choices[t]);
						}
					}
				}
			}
		}
		//nasz txt wysyłamy do DynamoDB jako od razu przetłumaczoną wersję.
		//JEDNAK
		//jest problem że getTranslatorEN_PL nie działa od razu i zwraca undefined i dupa...
		alert(JSON.stringify(JSON.parse(creator.text)));
		
};

creator.text = "{}";

(function questionAddScopeWrapper($) {
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

var abc = "";
$('#translate').click(function() {
	getTranslatorEN_PL("bad");
	
	//DO PRZEMYŚLENIA
	// function someFunc() {

	// callAjaxfunc(function() {
		// console.log('Pass2');
	// });

	// }

	// function callAjaxfunc(callback) {
		//All ajax calls called here
		// onAjaxSuccess: function() {
			// callback();
		// };
		// console.log('Pass1');    
	// }
});

$('#getA').click(function() {
	console.log(abc);
});

function getTranslatorEN_PL(text) {
	let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=en-ru&text=";
	url = url + text;
	$.ajax({url: url, success: function(result){
		console.log(result);
		var json = result;
		if(json.def[0] != null) {
			text_ = json.def[0].tr[0].text;
			console.log("tłumacz EN-RU: " + text + " --> " + text_);
			let url_ = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=ru-pl&text=";
			url_ = url_ + text_;
			$.ajax({url: url_, success: function(result){
				console.log(result);
				var json = result;
				if(json.def[0] != null) {
					var r = json.def[0].tr[0].text
					abc = r;
					console.log("tłumacz RU-PL: " + text_ + " --> " + r);
					//console.log(this.change);
					//return r;
				} else {
					alert("no traslate pl");
				}
			  }});
		} else {
			alert("no traslate ru");
		}
	  }});
}