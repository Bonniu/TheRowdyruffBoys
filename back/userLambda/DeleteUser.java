package com.amazonaws.lambda.demo;

import java.util.HashMap;
import java.util.LinkedHashMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

public class DeleteUser implements RequestHandler<Object, String> {

	@Override
	public String handleRequest(Object input, Context context) {

		HashMap<String, AttributeValue> item_values = new HashMap<String, AttributeValue>();
		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		item_values.put("userEmail", new AttributeValue(mapa.get("userEmail").toString()));

		AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
		ddb.deleteItem("usersWithTests", item_values);
		return "Deleted user " + item_values.toString();
	}

}