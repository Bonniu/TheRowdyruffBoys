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

Survey.surveyLocalization.supportedLocales = ["en", "pl"];

var creatorOptions = {
    questionTypes: ["text", "radiogroup"],
    showTranslationTab: true
};
var creator = new SurveyCreator.SurveyCreator("survey", creatorOptions);

creator.showToolbox = "right";
creator.showPropertyGrid = "right";

var jsonStr = '{"all":[]}';
var obj = JSON.parse(jsonStr);
Survey.surveyLocalization.supportedLocales = ["en", "pl"];

creator
	.toolbarItems
	.push({
		id: "custom-preview",
		visible: true,
		title: "Translate",
		action: function () {
			//console.log("elo");
			translate();
			//console.log(txt);
		}
	});

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


creator
    .toolbarItems
    .push({
        id: "custom-preview",
        visible: true,
        title: "Export to CSV",
        action: function () {
            console.log(JSON.stringify(JSON.parse(creator.text)));
            exportCSVFile(false, JSON.stringify(JSON.parse(creator.text)), "exported");
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
        success: function (resp) {
            console.log('on success');
            console.log(resp);
            alert(resp);
        },
        error: function (resp, err) {
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
        success: function (resp) {
            console.log('on success delete');
            console.log(resp);
            alert(resp);
        },
        error: function (resp, err) {
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

async function redirectToTestySecond(){
    function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	await sleep(2000);
	getElementsFromObj();
	//console.log(JSON.parse(JSON.stringify(txt)));
	creator.text = JSON.stringify(txt);
	alert('Translated test into Polish');
}

function JSONToCSVConvertor(JSONData) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';

    var line = '';
    for (var i = 0; i < arrData.length; i++) {
        if (arrData[i] == '"' && arrData[i+1] == ':' && arrData[i+2] == '"') {
            line=':';
            i=i+2;
        }
        else if (arrData[i] == '"' && arrData[i+1] == ',' && arrData[i+2] == '"') {
            line=',';
            i=i+2;
        }
        else if (arrData[i] == '"' && arrData[i+1] == ':' && arrData[i+2] == '[' && arrData[i+3] == '{' && arrData[i+4] == '"') {
            line=':\n';
            i=i+4;
        } 
        else if (arrData[i] == '"' && arrData[i+1] == '}' && arrData[i+2] == ',' && arrData[i+3] == '{' && arrData[i+4] == '"') {
            line=',\n';
            i=i+4;
        }
        else if (arrData[i] == '{' && arrData[i+1] == '"' ) {
            line='';
            i=i+1;
        }
        else if (arrData[i] == '"' || arrData[i] == '}' || arrData[i] == ']' ) {
            line='';
        }
        else line = arrData[i];

        CSV += line;

    }

    return CSV;
}



function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }
    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = this.JSONToCSVConvertor(jsonObject);
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function translate() {

	txt = JSON.parse(creator.text);
	if (txt != null) {
		for (let i = 0; i < txt.pages.length; i++) {
			for (let j = 0; j < txt.pages[i].elements.length; j++) {
				if (txt.pages[i].elements[j].type == "text") {
					obj.all.push({ "title": [] });
					var split_text = txt.pages[i].elements[j].title.split(" ");
					var how_many = split_text.length;
					for (let ii = 0; ii < how_many; ii++) {
						obj.all[j].title.push("");
					}
				} else if (txt.pages[i].elements[j].type == "radiogroup") {
					obj.all.push({ "title": [], "choices": [] });
					var split_text = txt.pages[i].elements[j].title.split(" ");
					var how_many = split_text.length;
					for (let ii = 0; ii < how_many; ii++) {
						obj.all[j].title.push("");
					}
					for (let t = 0; t < txt.pages[i].elements[j].choices.length; t++) {
						obj.all[j].choices.push({ "text": [] });
						var split_text = txt.pages[i].elements[j].choices[t].text.split(" ");
						var how_many = split_text.length;
						for (let ii = 0; ii < how_many; ii++) {
							obj.all[j].choices[t].text.push("");
						}
					}
				}
			}
		}
		//console.log(obj);

		//j --> które pytanie, jj --> które słowo, t--> która odpowiedź z konkretnego pytania
		for (let i = 0; i < txt.pages.length; i++) {
			for (let j = 0; j < txt.pages[i].elements.length; j++) {
				if (txt.pages[i].elements[j].type == "text") {
					var split_text = txt.pages[i].elements[j].title.split(" ");
					for (let jj = 0; jj < split_text.length; jj++) {
						//console.log(split_text[jj]);
						getTranslatorEN_PL_title(split_text[jj], j, jj);
					}

				} else if (txt.pages[i].elements[j].type == "radiogroup") {
					var split_text = txt.pages[i].elements[j].title.split(" ");
					for (let jj = 0; jj < split_text.length; jj++) {
						//console.log(split_text[jj]);
						getTranslatorEN_PL_title(split_text[jj], j, jj);
					}

					for (let t = 0; t < txt.pages[i].elements[j].choices.length; t++) {
						var split_text = txt.pages[i].elements[j].choices[t].text.split(" ");
						for (let jj = 0; jj < split_text.length; jj++) {
							//console.log(split_text[jj]);
							getTranslatorEN_PL_choices(split_text[jj], j, jj, t);
						}
					}
				}
			}
		}
		redirectToTestySecond();
    }
}

function getTranslatorEN_PL(text) {
    let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=en-ru&text=";
    url = url + text;
    $.ajax({
        url: url, success: function (result) {
            //console.log(result);
            var json = result;
            if (json.def[0] != null) {
                text_ = json.def[0].tr[0].text;
                //console.log("tłumacz EN-RU: " + text + " --> " + text_);
                let url_ = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=ru-pl&text=";
                url_ = url_ + text_;
                $.ajax({
                    url: url_, success: function (result) {
                        //console.log(result);
                        var json = result;
                        if (json.def[0] != null) {
                            var r = json.def[0].tr[0].text
                            //console.log("tłumacz RU-PL: " + text_ + " --> " + r);
                        } else {
                            //alert("no traslate pl");
                        }
                    }
                });
            } else {
                //alert("no traslate ru");
            }
        }
    });
}

function getTranslatorEN_PL_title(text, j, jj) {
    let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=en-ru&text=";
    url = url + text;
    $.ajax({
        url: url, success: function (result) {
            //console.log(result);
            var json = result;
            if (json.def[0] != null) {
                text_ = json.def[0].tr[0].text;
                //console.log("tłumacz EN-RU: " + text + " --> " + text_);
                let url_ = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=ru-pl&text=";
                url_ = url_ + text_;
                $.ajax({
                    url: url_, success: function (result) {
                        //console.log(result);
                        var json = result;
                        if (json.def[0] != null) {
                            var r = json.def[0].tr[0].text
                            //txt.pages[i].elements[j].title = r;
                            obj.all[j].title[jj] = r;
                            //console.log("tłumacz RU-PL: " + text_ + " --> " + r);
                        } else {
                            //alert("no traslate pl");
                        }
                    }
                });
            } else {
                //alert("no traslate ru");
            }
        }
    });
}

function getTranslatorEN_PL_choices(text, j, jj, t) {
    let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=en-ru&text=";
    url = url + text;
    $.ajax({
        url: url, success: function (result) {
            //console.log(result);
            var json = result;
            if (json.def[0] != null) {
                text_ = json.def[0].tr[0].text;
                //console.log("tłumacz EN-RU: " + text + " --> " + text_);
                let url_ = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20191230T110607Z.67ee80aaff673d64.91f4ec360d12511dd6be5aaa55ae8b24ef99214f&lang=ru-pl&text=";
                url_ = url_ + text_;
                $.ajax({
                    url: url_, success: function (result) {
                        //console.log(result);
                        var json = result;
                        if (json.def[0] != null) {
                            var r = json.def[0].tr[0].text
                            //txt.pages[i].elements[j].choices[t].text = r;
                            obj.all[j].choices[t].text[jj] = r;
                            //console.log("tłumacz RU-PL: " + text_ + " --> " + r);
                        } else {
                           // alert("no traslate pl");
                        }
                    }
                });
            } else {
               // alert("no traslate ru");
            }
        }
    });
}




function getElementsFromObj() {
	//console.log("getElementsFromObj");
	//alert("getElementsFromObj");
	for (let i = 0; i < txt.pages.length; i++) {
		for (let j = 0; j < txt.pages[i].elements.length; j++) {
			if (txt.pages[i].elements[j].type == "text") {
				var split_text = txt.pages[i].elements[j].title.split(" ");
				for (let jj = 0; jj < split_text.length; jj++) {
					getTranslateFromObjToTxt_title(i, j, jj);
				}

			} else if (txt.pages[i].elements[j].type == "radiogroup") {
				var split_text = txt.pages[i].elements[j].title.split(" ");
				for (let jj = 0; jj < split_text.length; jj++) {
					getTranslateFromObjToTxt_title(i, j, jj);
				}

				for (let t = 0; t < txt.pages[i].elements[j].choices.length; t++) {
					var split_text = txt.pages[i].elements[j].choices[t].text.split(" ");
					for (let jj = 0; jj < split_text.length; jj++) {
						getTranslateFromObjToTxt_choices(i, j, jj, t);
					}
				}
			}
		}
	}
}

function getTranslateFromObjToTxt_title(i, j, jj) {
	if (jj == 0) {
		txt.pages[i].elements[j].title = "";
	}
	txt.pages[i].elements[j].title += obj.all[j].title[jj] + " ";
}

function getTranslateFromObjToTxt_choices(i, j, jj, t) {
	if (jj == 0) {
		txt.pages[i].elements[j].choices[t].text = "";
	}
	txt.pages[i].elements[j].choices[t].text += obj.all[j].choices[t].text[jj] + " ";
}

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