package the.rowdyruff.boys;

import java.util.ArrayList;
import java.util.LinkedHashMap;

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

		ArrayList<String> questionIDList = (ArrayList<String>) testTable
				.getItem("test_id", mapa.get("test_id").toString()).get("questions_id");
		System.out.println(questionIDList);
		ArrayList<Item> questionList = new ArrayList<Item>();
		for (int i = 0; i < questionIDList.size(); i++) {
			String question_id = questionIDList.get(i);
			Item question = getQuestionFromID(question_id);
			System.out.println(question);
			questionList.add(question);
		}
		return questionList.toString();
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

}
