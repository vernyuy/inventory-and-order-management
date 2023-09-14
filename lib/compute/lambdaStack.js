"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const SQS = require("aws-cdk-lib/aws-sqs");
const aws_lambda_destinations_1 = require("aws-cdk-lib/aws-lambda-destinations");
class LambdaStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dlq = new SQS.Queue(this, "dlq");
        const queueConsumer = new lambda.Function(this, "consumerFunction", {
            handler: "queueConsumer.main",
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            environment: {
                TABLE_NAME: props.ddbTable.tableName,
                QUEUE_NAME: props.queue.queueName,
                QUEUE_URL: props.queue.queueUrl,
                // test: props.targetLambda.functionName
            },
            //   layers: [powertoolsLayer],
            onFailure: new aws_lambda_destinations_1.SqsDestination(dlq),
        });
        const process_order = new lambda.Function(this, "processOrder", {
            handler: "processOrder.main",
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            environment: {
                TABLE_NAME: props.ddbTable.tableName,
                QUEUE_NAME: props.queue.queueName,
                QUEUE_URL: props.queue.queueUrl,
            },
            // layers: [powertoolsLayer],
        });
        process_order.addEventSource(new aws_lambda_event_sources_1.DynamoEventSource(props.ddbTable, {
            startingPosition: lambda.StartingPosition.LATEST,
        }));
        props.ddbTable.grantStreamRead(process_order);
        props.ddbTable.grantReadWriteData(process_order);
        const streamConsumer = new lambda.Function(this, "streamConsumer", {
            handler: "streamConsumer.main",
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            environment: {
                TABLE_NAME: props.ddbTable.tableName,
                QUEUE_NAME: props.queue.queueName,
                QUEUE_URL: props.queue.queueUrl,
            },
            // layers: [powertoolsLayer],
            role: queueConsumer.role,
        });
        streamConsumer.addEventSource(new aws_lambda_event_sources_1.DynamoEventSource(props.ddbTable, {
            startingPosition: lambda.StartingPosition.LATEST,
        }));
        queueConsumer.addEventSource(new aws_lambda_event_sources_1.SqsEventSource(props.queue));
        props.queue.grantConsumeMessages(queueConsumer);
        props.queue.grantSendMessages(streamConsumer);
        props.ddbTable.grantReadWriteData(queueConsumer);
        props.ddbTable.grantStreamRead(streamConsumer);
        props.ddbTable.grantReadWriteData(streamConsumer);
    }
}
exports.LambdaStack = LambdaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGFTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsaURBQWlEO0FBQ2pELG1GQUc4QztBQUc5QywyQ0FBMkM7QUFDM0MsaUZBQXFFO0FBUXJFLE1BQWEsV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3hDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2QyxNQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ2xFLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2xDLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTO2dCQUNwQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTO2dCQUNqQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRO2dCQUMvQix3Q0FBd0M7YUFDekM7WUFDRCwrQkFBK0I7WUFDL0IsU0FBUyxFQUFFLElBQUksd0NBQWMsQ0FBQyxHQUFHLENBQUM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDOUQsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDbEMsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVM7Z0JBQ3BDLFVBQVUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVM7Z0JBQ2pDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVE7YUFDaEM7WUFDRCw2QkFBNkI7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsYUFBYSxDQUFDLGNBQWMsQ0FDMUIsSUFBSSw0Q0FBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ3BDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNO1NBQ2pELENBQUMsQ0FDSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRCxNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2pFLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2xDLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTO2dCQUNwQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTO2dCQUNqQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRO2FBQ2hDO1lBQ0QsNkJBQTZCO1lBQzdCLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSTtTQUN6QixDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsY0FBYyxDQUMzQixJQUFJLDRDQUFpQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDcEMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU07U0FDakQsQ0FBQyxDQUNILENBQUM7UUFFRixhQUFhLENBQUMsY0FBYyxDQUFDLElBQUkseUNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUU5RCxLQUFLLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvQyxLQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDRjtBQW5FRCxrQ0FtRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7XG4gIER5bmFtb0V2ZW50U291cmNlLFxuICBTcXNFdmVudFNvdXJjZSxcbn0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlc1wiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIER5bmFtb2RiIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCAqIGFzIFNRUyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNxc1wiO1xuaW1wb3J0IHsgU3FzRGVzdGluYXRpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYS1kZXN0aW5hdGlvbnNcIjtcblxuLy8gaW1wb3J0IHtDZGtJbXNQcm9qZWN0U3RhY2t9IGZyb20gJy4uL2Nkay1pbXMtcHJvamVjdC1zdGFjayc7XG5cbmludGVyZmFjZSBMYW1iZGFTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBkZGJUYWJsZTogRHluYW1vZGIuVGFibGU7XG4gIHF1ZXVlOiBTUVMuUXVldWU7XG59XG5leHBvcnQgY2xhc3MgTGFtYmRhU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGFtYmRhU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZGxxID0gbmV3IFNRUy5RdWV1ZSh0aGlzLCBcImRscVwiKTtcblxuICAgIGNvbnN0IHF1ZXVlQ29uc3VtZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIFwiY29uc3VtZXJGdW5jdGlvblwiLCB7XG4gICAgICBoYW5kbGVyOiBcInF1ZXVlQ29uc3VtZXIubWFpblwiLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoXCJzcmNcIiksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBwcm9wcy5kZGJUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFFVRVVFX05BTUU6IHByb3BzLnF1ZXVlLnF1ZXVlTmFtZSxcbiAgICAgICAgUVVFVUVfVVJMOiBwcm9wcy5xdWV1ZS5xdWV1ZVVybCxcbiAgICAgICAgLy8gdGVzdDogcHJvcHMudGFyZ2V0TGFtYmRhLmZ1bmN0aW9uTmFtZVxuICAgICAgfSxcbiAgICAgIC8vICAgbGF5ZXJzOiBbcG93ZXJ0b29sc0xheWVyXSxcbiAgICAgIG9uRmFpbHVyZTogbmV3IFNxc0Rlc3RpbmF0aW9uKGRscSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9jZXNzX29yZGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcInByb2Nlc3NPcmRlclwiLCB7XG4gICAgICBoYW5kbGVyOiBcInByb2Nlc3NPcmRlci5tYWluXCIsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChcInNyY1wiKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHByb3BzLmRkYlRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgUVVFVUVfTkFNRTogcHJvcHMucXVldWUucXVldWVOYW1lLFxuICAgICAgICBRVUVVRV9VUkw6IHByb3BzLnF1ZXVlLnF1ZXVlVXJsLFxuICAgICAgfSxcbiAgICAgIC8vIGxheWVyczogW3Bvd2VydG9vbHNMYXllcl0sXG4gICAgfSk7XG4gICAgcHJvY2Vzc19vcmRlci5hZGRFdmVudFNvdXJjZShcbiAgICAgIG5ldyBEeW5hbW9FdmVudFNvdXJjZShwcm9wcy5kZGJUYWJsZSwge1xuICAgICAgICBzdGFydGluZ1Bvc2l0aW9uOiBsYW1iZGEuU3RhcnRpbmdQb3NpdGlvbi5MQVRFU1QsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBwcm9wcy5kZGJUYWJsZS5ncmFudFN0cmVhbVJlYWQocHJvY2Vzc19vcmRlcik7XG4gICAgcHJvcHMuZGRiVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHByb2Nlc3Nfb3JkZXIpO1xuXG4gICAgY29uc3Qgc3RyZWFtQ29uc3VtZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIFwic3RyZWFtQ29uc3VtZXJcIiwge1xuICAgICAgaGFuZGxlcjogXCJzdHJlYW1Db25zdW1lci5tYWluXCIsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChcInNyY1wiKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHByb3BzLmRkYlRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgUVVFVUVfTkFNRTogcHJvcHMucXVldWUucXVldWVOYW1lLFxuICAgICAgICBRVUVVRV9VUkw6IHByb3BzLnF1ZXVlLnF1ZXVlVXJsLFxuICAgICAgfSxcbiAgICAgIC8vIGxheWVyczogW3Bvd2VydG9vbHNMYXllcl0sXG4gICAgICByb2xlOiBxdWV1ZUNvbnN1bWVyLnJvbGUsXG4gICAgfSk7XG5cbiAgICBzdHJlYW1Db25zdW1lci5hZGRFdmVudFNvdXJjZShcbiAgICAgIG5ldyBEeW5hbW9FdmVudFNvdXJjZShwcm9wcy5kZGJUYWJsZSwge1xuICAgICAgICBzdGFydGluZ1Bvc2l0aW9uOiBsYW1iZGEuU3RhcnRpbmdQb3NpdGlvbi5MQVRFU1QsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBxdWV1ZUNvbnN1bWVyLmFkZEV2ZW50U291cmNlKG5ldyBTcXNFdmVudFNvdXJjZShwcm9wcy5xdWV1ZSkpO1xuXG4gICAgcHJvcHMucXVldWUuZ3JhbnRDb25zdW1lTWVzc2FnZXMocXVldWVDb25zdW1lcik7XG4gICAgcHJvcHMucXVldWUuZ3JhbnRTZW5kTWVzc2FnZXMoc3RyZWFtQ29uc3VtZXIpO1xuICAgIHByb3BzLmRkYlRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShxdWV1ZUNvbnN1bWVyKTtcbiAgICBwcm9wcy5kZGJUYWJsZS5ncmFudFN0cmVhbVJlYWQoc3RyZWFtQ29uc3VtZXIpO1xuICAgIHByb3BzLmRkYlRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShzdHJlYW1Db25zdW1lcik7XG4gIH1cbn1cbiJdfQ==