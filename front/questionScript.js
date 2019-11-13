
var options = {
    showLogicTab: true
};
var creator = new SurveyCreator.SurveyCreator("creatorElement", options);


//Setting this callback will make visible the "Save" button
creator.saveSurveyFunc = function () {
    //save the survey JSON
    console.log(creator.text);
}

creator.text = "{ pages: [{ name:\'page1\', questions: [{ type: \'text\', name:\"q1\"}]}]}";