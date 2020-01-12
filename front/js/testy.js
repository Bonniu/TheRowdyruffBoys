

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
            exportCSVFile(false, creator.text, "exported");
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

function JSONToCSVConvertor(objArray) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';

    var line = '';
    for (var i = 0; i < arrData.length; i++) {
        // if (arrData[i] != '{' && arrData[i] != '}' && arrData[i] != '[' && arrData[i] != ']' && arrData[i] != '"' ) {
        line = arrData[i];
        // }
        // else if (arrData[i] == '{') {
        //     line = '\n';
        // }
        // else line = '';

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