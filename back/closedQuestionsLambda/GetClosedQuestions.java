package the.rowdyruff.boys;

import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

public class GetClosedQuestions implements RequestHandler<Object, String> {

	@Override
	public String handleRequest(Object input, Context context) {
		AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
		ScanResult result = ddb.scan(new ScanRequest().withTableName("closedQuestions"));
		return result.toString();
	}

}
