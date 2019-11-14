package the.rowdyruff.boys;

import java.util.HashMap;
import java.util.LinkedHashMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

public class DeleteClosedQuestion implements RequestHandler<Object, String> {

	@Override
	public String handleRequest(Object input, Context context) {

		HashMap<String, AttributeValue> item_values = new HashMap<String, AttributeValue>();
		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		item_values.put("cq_id", new AttributeValue(mapa.get("cq_id").toString()));

		AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
		ddb.deleteItem("closedQuestions", item_values);
		return "Deleted item" + item_values.toString();
	}

}