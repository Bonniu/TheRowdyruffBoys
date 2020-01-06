package the.rowdyruff.boys;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class DeleteTestFromDB implements RequestHandler<Object, String> {

	AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
	DynamoDB dynamoDB = new DynamoDB(ddb);
	Table testTable = dynamoDB.getTable("testTable");
	Table closedQuestions = dynamoDB.getTable("closedQuestions");
	Table openQuestions = dynamoDB.getTable("openQuestions");

	@Override
	public String handleRequest(Object input, Context context) {
		String test_id;
		try {
			test_id = Long.toString((Long) input);
		} catch (ClassCastException exception) {
			test_id = Integer.toString((Integer) input);
		} catch (Exception exception) {
			return "Error while removing test";
		}

		Item item = testTable.getItem("test_id", test_id);
		String str = (String) item.get("questions_id");
		str = str.replace("\"", "").replace("S", "").replace(":", "").replace("{", "");
		str = str.replace("}", "").replace("[", "").replace("]", "");
		String[] tmpTab = str.split(",");
		ArrayList<String> questionIDList = new ArrayList<String>();
		for (int i = 0; i < tmpTab.length; i++) {
			questionIDList.add(tmpTab[i]);
			deleteQuestion(questionIDList.get(i));
		}
		// usuwanie testu
		HashMap<String, AttributeValue> item_test = new HashMap<String, AttributeValue>();
		item_test.put("test_id", new AttributeValue(test_id));
		ddb.deleteItem("testTable", (Map<String, AttributeValue>) item_test);
		try {
			ddb.deleteItem("usersWithTests", (Map<String, AttributeValue>) item_test);
		} catch (AmazonDynamoDBException ignored) {
			
		}
		return "Deleted test with id=" + test_id;
	}

	public void deleteQuestion(String questionID) {
		try {
			HashMap<String, AttributeValue> item = new HashMap<String, AttributeValue>();
			item.put("oq_id", new AttributeValue(questionID));
			ddb.deleteItem("openQuestions", (Map<String, AttributeValue>) item);
		} catch (Exception ignored) {
		}
		try {
			HashMap<String, AttributeValue> item = new HashMap<String, AttributeValue>();
			item.put("cq_id", new AttributeValue(questionID));
			ddb.deleteItem("closedQuestions", (Map<String, AttributeValue>) item);
		} catch (Exception ignored) {
		}
	}

}