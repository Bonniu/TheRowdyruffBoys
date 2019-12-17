package com.amazonaws.lambda.demo;

import java.util.LinkedHashMap;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class getUserWithTest implements RequestHandler<Object, String> {

	AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
	DynamoDB dynamoDB = new DynamoDB(ddb);
	Table testTable = dynamoDB.getTable("usersWithTests");
	
	@Override
	public String handleRequest(Object input, Context context) {
		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		String questionIDList = (String) testTable
				.getItem("userEmail", mapa.get("userEmail").toString()).get("test_id");
		if(questionIDList.length() == 0 || questionIDList == null) {
			return "noTestForThisUser";
		}
		return questionIDList;
	}

}