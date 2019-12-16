package com.amazonaws.lambda.demo;


import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import java.util.LinkedHashMap;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

public class GetUsers implements RequestHandler<Object, String> {

	@Override
	public String handleRequest(Object input, Context context) {

		LinkedHashMap<?, ?> mapa = (LinkedHashMap<?, ?>) input;
		String userEmail = "{S: " + mapa.get("userEmail").toString() + ",}";
		AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
		ScanResult result = ddb.scan(new ScanRequest().withTableName("usersWithTests"));
		String zmienna = "1" + userEmail + " ";
		for(int i = 0; i < result.getItems().size(); i++) {
			zmienna += "2" + result.getItems().get(i).get("userEmail").toString() + " ";
			if(result.getItems().get(i).get("userEmail").toString().equals(userEmail)) {
				String nowe = result.getItems().get(i).get("test_id").toString();
				nowe = nowe.substring(4, nowe.length() - 2);
				return nowe;
			}
		}
		
		return zmienna;
	}

}