package the.rowdyruff.boys;

import java.util.ArrayList;
import java.util.LinkedHashMap;

import org.json.JSONArray;
import org.json.JSONObject;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class getQuestionsFromTest implements RequestHandler<Object, String> {

	AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
	DynamoDB dynamoDB = new DynamoDB(ddb);
	Table testTable = dynamoDB.getTable("testTable");
	Table closedQuestions = dynamoDB.getTable("closedQuestions");
	Table openQuestions = dynamoDB.getTable("openQuestions");

	@SuppressWarnings("unchecked")
	@Override
	public String handleRequest(Object input, Context context) {

		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		System.out.println(mapa);
		System.out.println(input);
		System.out.println(mapa.get("test_id").toString());
		String questionIDlistStr = (String) testTable.getItem("test_id", mapa.get("test_id").toString()).get("questions_id");
		System.out.println(questionIDlistStr);
		questionIDlistStr = questionIDlistStr.replace("\"", "").replace("S", "").replace(":", "").replace("{", "");
		questionIDlistStr = questionIDlistStr.replace("}", "").replace("[", "").replace("]", "");
		String[] tmpTab = questionIDlistStr.split(",");
		ArrayList<String> questionIDList = new ArrayList<String>();
		for(int i = 0; i < tmpTab.length; i++) {
			questionIDList.add(tmpTab[i]);
		}
		System.out.println(questionIDList);
		
		ArrayList<Item> questionList = new ArrayList<Item>();
		JSONArray jsonList = new JSONArray();
		for (int i = 0; i < questionIDList.size(); i++) {
			Item question = getQuestionFromID(questionIDList.get(i));
			questionList.add(question);
			if (question.isPresent("cq_id")) {
				jsonList.put(generateClosedQuestion(question, i));
			} else if (question.isPresent("oq_id")) {
				jsonList.put(generateOpenQuestion(question, i));
			}
		}
		JSONObject test = convertToJSON(jsonList);
		System.out.println(test.toString(4));
		return test.toString();
	}

	public JSONObject convertToJSON(JSONArray jsonList) {
		JSONObject tmp = new JSONObject("{\"name\": \"page1\"}"); // jak bedzie wieceej stron to petla bedzie musialabyc
		tmp.put("elements", jsonList);
		JSONArray pages = new JSONArray();
		pages.put(tmp);
		return new JSONObject().put("pages", pages);
	}

	public Item getQuestionFromID(String id) {
		if (closedQuestions.getItem("cq_id", id) != null)
			return closedQuestions.getItem("cq_id", id);
		else if (openQuestions.getItem("oq_id", id) != null)
			return openQuestions.getItem("oq_id", id);
		else {
			System.out.println("Pytanie " + id + "nie znajduje sie w zadnej tabeli");
			return null;
		}
	}

	public JSONObject generateClosedQuestion(Item question, int index) {
		JSONObject closedQuestion = new JSONObject();
		JSONObject a = new JSONObject("{\"value\": \"item1\", \"text\": \"" + question.getString("a") + "\"}");
		JSONObject b = new JSONObject("{\"value\": \"item2\", \"text\": \"" + question.getString("b") + "\"}");
		JSONObject c = new JSONObject("{\"value\": \"item3\", \"text\": \"" + question.getString("c") + "\"}");
		JSONObject d = new JSONObject("{\"value\": \"item4\", \"text\": \"" + question.getString("d") + "\"}");
		JSONArray choices = new JSONArray();
		choices.put(a).put(b).put(c).put(d);
		closedQuestion.put("type", "checkbox");
		closedQuestion.put("name", "Question " + Integer.toString(index + 1));
		closedQuestion.put("title", question.getString("question"));
		closedQuestion.put("choices", choices);
		return closedQuestion;
	}

	public JSONObject generateOpenQuestion(Item question, int index) {
		JSONObject openQuestion = new JSONObject();
		openQuestion.put("type", "text");
		openQuestion.put("name", "Question " + Integer.toString(index + 1));
		openQuestion.put("title", question.getString("question"));
		return openQuestion;
	}

}
