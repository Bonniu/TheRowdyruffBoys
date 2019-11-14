package the.rowdyruff.boys;

import java.util.HashMap;
import java.util.LinkedHashMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;


public class InsertClosedQuestion implements RequestHandler<Object, String> {

	@Override
	public String handleRequest(Object input, Context context) {

		HashMap<String, AttributeValue> item_values = new HashMap<String, AttributeValue>();
		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		item_values.put("cq_id", new AttributeValue(context.getAwsRequestId()));
		item_values.put("a", new AttributeValue(mapa.get("a").toString()));
		item_values.put("b", new AttributeValue(mapa.get("b").toString()));
		item_values.put("c", new AttributeValue(mapa.get("c").toString()));
		item_values.put("d", new AttributeValue(mapa.get("d").toString()));
		item_values.put("question", new AttributeValue(mapa.get("question").toString()));
		item_values.put("answer", new AttributeValue(mapa.get("answer").toString()));
		AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard()
				.withRegion(Regions.US_EAST_1)
				.build();	
		ddb.putItem("closedQuestions", item_values);
		return "Put item" + item_values.toString();
	}
	
}