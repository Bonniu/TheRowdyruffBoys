package the.rowdyruff.boys;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.json.JSONObject;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
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

		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		System.out.println(mapa.get("test_id"));
		String test_id = mapa.get("test_id").toString();
		JSONObject js = new JSONObject(mapa);
		System.out.println(js);
		//System.out.println(js.get("test_id"));

		Item item = testTable.getItem("test_id", test_id);
		System.out.println(item.toJSONPretty());

		String str = (String) item.get("questions_id");
		str = str.replace("\"", "").replace("S", "").replace(":", "").replace("{", "");
		str = str.replace("}", "").replace("[", "").replace("]", "");
		String[] tmpTab = str.split(",");
		ArrayList<String> questionIDList = new ArrayList<String>();
		for (int i = 0; i < tmpTab.length; i++) {
			questionIDList.add(tmpTab[i]);
			deleteQuestion(questionIDList.get(i));
		}
		System.out.println(questionIDList);

		// usuwanie testu
		HashMap<String, AttributeValue> item_test = new HashMap<String, AttributeValue>();
		item_test.put("test_id", new AttributeValue(test_id));
		ddb.deleteItem("testTable", (Map<String, AttributeValue>) item_test);

		return "Deleted test " + test_id + " and questions";
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