// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = function(event, ctx, callback) {
    
    let params = {
       TableName: "openQuestions",
       Item: {
           question: event.question,
           max_pts: event.max_pts,
           oq_id: ctx.awsRequestId
       }
   }; 
   
   
  
   docClient.put(params, function(err, data) {
       if(err) callback(err,null);
       else callback(null,data);
   });
};
