// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = function(e, ctx, callback) {
    
    
   let scanningParams = {
       TableName: "closedQuestions",
       Limit: 100
   };
   
   docClient.scan(scanningParams, function(err, data) {
       if(err) callback(err,null);
       else callback(null,data);
   });
    
};
