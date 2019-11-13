// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = function(event, ctx, callback) {
    
    let params = {
        TableName: "openQuestions",
        Key: {
            "oq_id": event.oq_id
        }
    }; 
   
   docClient.delete(params, function(err, data) {
       if(err) callback(err,null);
       else callback(null,data);
   });
};
