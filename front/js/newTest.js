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

var jsonStr = '{"all":[]}';
var obj = JSON.parse(jsonStr);


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
			//window.location.href = 'testy.html';
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
		if(txt != null) {
			for( let i = 0; i < txt.pages.length; i++) {
				for( let j = 0; j < txt.pages[i].elements.length; j++) {
					if(txt.pages[i].elements[j].type == "text") {
						//getTranslatorEN_PL_title(txt.pages[i].elements[j].title, i, j);
						obj.all.push({"title":[]});
						var split_text = txt.pages[i].elements[j].title.split(" ");
						var how_many = split_text.length;
						for(let ii = 0; ii < how_many; ii++) {
							obj.all[j].title.push("");
						}
						
					} else if(txt.pages[i].elements[j].type == "radiogroup") {
						//getTranslatorEN_PL_title(txt.pages[i].elements[j].title, i, j);
						obj.all.push({"title":[], "choices":[[],[],[]]});
						var split_text = txt.pages[i].elements[j].title.split(" ");
						var how_many = split_text.length;
						for(let ii = 0; ii < how_many; ii++) {
							obj.all[j].title.push("");
						}
						
						for(let t = 0; t < txt.pages[i].elements[j].choices.length; t++) {
							//getTranslatorEN_PL_choices(txt.pages[i].elements[j].choices[t].text, i, j, t);
						}
					}
				}
			}
			console.log(obj);
		}
		//DZIAŁA tylko dla pojedynczych słów XD
		
		//muszę zrobić oddzielne listy na przechowywanie tych tłumaczeń i muszą być oznaczone i wkładane na odpowiednie miejsce.
		
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


$('#translate').click(function() {
	//getTranslatorEN_PL("bad");
	// var a = "hello this is my question";
	// var b = a.split(" ");
	// console.log(b);
	
	var jsonStr = '{"all":[]}';
	var obj = JSON.parse(jsonStr);
	//DECYZJA CZY OTWARTE CZY ZAMKNIĘTE --> policzenie ile słów w title i w kazdym z choices
	obj.all.push({"title":[]});
	obj.all[0].title.push("","","","");
	obj.all.push({"title":[]});
	obj.all.push({"title":[], "choices":[{"0":[]},{"1":[]},{"2":[]}]});
	//jsonStr = JSON.stringify(obj);
	console.log(obj.all[0]);
	
});

$('#gettxt').click(function() {
	//TO JEST DO dynamoDB do przekazania
	console.log(JSON.stringify(txt));
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
					//abc = r;
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

function getTranslatorEN_PL_title(text, i, j) {
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
					txt.pages[i].elements[j].title = r;
					console.log("tłumacz RU-PL: " + text_ + " --> " + r);
				} else {
					alert("no traslate pl");
				}
			  }});
		} else {
			alert("no traslate ru");
		}
	  }});
}

function getTranslatorEN_PL_choices(text, i, j, t) {
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
					txt.pages[i].elements[j].choices[t].text = r;
					console.log("tłumacz RU-PL: " + text_ + " --> " + r);
				} else {
					alert("no traslate pl");
				}
			  }});
		} else {
			alert("no traslate ru");
		}
	  }});
}