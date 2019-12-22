package the.rowdyruff.boys;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;

import org.json.JSONArray;
import org.json.JSONObject;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class InsertTestIntoDB implements RequestHandler<Object, String> {

	AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
	DynamoDB dynamoDB = new DynamoDB(ddb);
	Table testTable = dynamoDB.getTable("testTable");
	Table closedQuestions = dynamoDB.getTable("closedQuestions");
	Table openQuestions = dynamoDB.getTable("openQuestions");

	@Override
	public String handleRequest(Object input, Context context) {

		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		JSONObject js = new JSONObject(mapa);
		// z jsona bierzemy tablice 'pages', potem element 'elements' i na koniec
		// tablice elementów 'elements'
		JSONArray questionList = js.getJSONArray("pages").getJSONObject(0).getJSONArray("elements");
		ArrayList<String> idList = new ArrayList<String>();
		for (int i = 0; i < questionList.length(); i++) {
			JSONObject questionJSON = (JSONObject) questionList.get(i);
			if (questionJSON.getString("type").equals("radiogroup")) {
				HashMap<String, String> cQuestion = parseClosedQuestion(questionJSON);
				idList.add(addClosedQuestionToDatabase(cQuestion, context, i));

			} else if (questionJSON.getString("type").equals("text")) {
				HashMap<String, Object> oQuestion = parseOpenQuestion(questionJSON);
				idList.add(addOpenQuestionToDatabase(oQuestion, context, i));
			}
		}
		return addTest(idList, context);
	}

	public String addTest(ArrayList<String> idList, Context context) {
		HashMap<String, AttributeValue> testMap = new HashMap<String, AttributeValue>();
		JSONArray ids = new JSONArray();
		for(int i = 0 ; i < idList.size(); i++) {
			HashMap<String, String> questionId = new HashMap<String, String>();
			questionId.put("S", idList.get(i));
			ids.put(questionId);
		}	
		testMap.put("test_id", new AttributeValue(replaceLetters(context.getAwsRequestId().substring(0, 10))));
		testMap.put("questions_id", new AttributeValue(ids.toString()));
		ddb.putItem("testTable", testMap);
		return "Put Test with ids: " + idList.toString();
	}

	public HashMap<String, Object> parseOpenQuestion(JSONObject questionJSON) {
		String questionStr = questionJSON.getString("title");
		HashMap<String, Object> question = new HashMap<String, Object>();
		question.put("question", questionStr);
		question.put("max_pts", 2); // tutaj dodac potem -------------------------
		return question;
	}

	public HashMap<String, String> parseClosedQuestion(JSONObject questionJSON) {
		HashMap<String, String> closedQuestion = new HashMap<>();
		String question = questionJSON.getString("title");
		closedQuestion.put("question", question);
		JSONArray choices = questionJSON.getJSONArray("choices");
		ArrayList<String> answerList = new ArrayList<>();
		for (int i = 0; i < choices.length(); i++) {
			if (i == 4)
                break;
			JSONObject answer = choices.getJSONObject(i);
			answerList.add(answer.getString("text"));
		}
		while (answerList.size() < 4) {
			answerList.add("Nie wiem");
		}
		String correctAnswer = answerList.get(0);
		Collections.shuffle(answerList);
		for (int i = 0; i < answerList.size(); i++) {
			closedQuestion.put(getStringFromInt(i), answerList.get(i));
			if (answerList.get(i).equals(correctAnswer))
				closedQuestion.put("answer", getStringFromInt(i));
		}
		return closedQuestion;
	}

	public String getStringFromInt(int i) {
		switch (i) {
		case 1:
			return "a";
		case 2:
			return "b";
		case 3:
			return "c";
		default:
			return "d";
		}
	}

	public String addOpenQuestionToDatabase(HashMap<String, Object> oQuestion, Context context, int i) {
		String questionId = Integer.toString(i) + replaceLetters(context.getAwsRequestId().substring(1, 9));
		HashMap<String, AttributeValue> item_values = new HashMap<String, AttributeValue>();
		item_values.put("oq_id", new AttributeValue(questionId));
		item_values.put("max_pts", new AttributeValue(oQuestion.get("max_pts").toString()));
		item_values.put("question", new AttributeValue(oQuestion.get("question").toString()));
		ddb.putItem("openQuestions", item_values);
		System.out.println("open: Put item" + item_values.toString());
		return questionId;

	}

	public String addClosedQuestionToDatabase(HashMap<String, String> cQuestion, Context context, int i) {
		String questionId = Integer.toString(i) + replaceLetters(context.getAwsRequestId().substring(1, 9));
		HashMap<String, AttributeValue> item_values = new HashMap<String, AttributeValue>();
		item_values.put("cq_id", new AttributeValue(questionId));
		item_values.put("a", new AttributeValue(cQuestion.get("a")));
		item_values.put("b", new AttributeValue(cQuestion.get("b")));
		item_values.put("c", new AttributeValue(cQuestion.get("c")));
		item_values.put("d", new AttributeValue(cQuestion.get("d")));
		item_values.put("question", new AttributeValue(cQuestion.get("question")));
		item_values.put("answer", new AttributeValue(cQuestion.get("answer")));
		ddb.putItem("closedQuestions", item_values);
		System.out.println("closed: Put item" + item_values.toString());
		return questionId;

	}
	
	public String replaceLetters(String input) {
		String result = input;
		result = result.replace("a", "1").replace("b", "2").replace("c", "3")
				.replace("d", "4").replace("e", "5").replace("f", "6").replace("-", "0");
		System.out.println(input);
		System.out.println(result);
		return result;
	}

}
