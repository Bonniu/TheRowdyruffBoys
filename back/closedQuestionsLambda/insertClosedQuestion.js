// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = function(event, ctx, callback) {
    
    let params = {
       TableName: "closedQuestions",
       Item: {
           a: event.a,
           b: event.b,
           c: event.c,
           d: event.d,
           question: event.question,
           answer: event.answer,
           cq_id: ctx.awsRequestId
       }
   }; 
   
   
  
   docClient.put(params, function(err, data) {
       if(err) callback(err,null);
       else callback(null,data);
   });
};
