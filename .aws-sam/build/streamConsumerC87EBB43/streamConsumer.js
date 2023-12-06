"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const AWS = __importStar(require("aws-sdk"));
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const tracer_1 = require("@aws-lambda-powertools/tracer");
const version_1 = require("@aws-lambda-powertools/commons/lib/version");
// import { Stripe } from "stripe";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stripe = require("stripe")("sk_test_51NVJ4RECpTjJRRCodmsyMIK613vbK0ElhyUwMReszzx6qs8FzZQDdi8VtZ5DjYkn5gNQryjTDMNkf01QLKVwxwTP00DT8HavNL");
const sqs = new AWS.SQS();
// const stripe = new Stripe(
//   "sk_test_51NVJ4RECpTjJRRCodmsyMIK613vbK0ElhyUwMReszzx6qs8FzZQDdi8VtZ5DjYkn5gNQryjTDMNkf01QLKVwxwTP00DT8HavNL",
//   {
//     typescript: true,
//     apiVersion: "2023-10-16",
//   }
// );
const defaultValues = {
    region: process.env.AWS_REGION || "N/A",
    executionEnv: process.env.AWS_EXECUTION_ENV || "N/A",
};
const logger = new logger_1.Logger({
    persistentLogAttributes: {
        ...defaultValues,
        logger: {
            name: "@aws-lambda-powertools/logger",
            version: version_1.PT_VERSION,
        },
    },
});
const metrics = new metrics_1.Metrics({
    defaultDimensions: defaultValues,
});
const tracer = new tracer_1.Tracer();
async function main(event, context) {
    logger.info("Lambda invocation event", { event });
    // Metrics: Capture cold start metrics
    metrics.captureColdStartMetric();
    // Tracer: Annotate the subsegment with the cold start & serviceName
    tracer.annotateColdStart();
    tracer.addServiceNameAnnotation();
    // Tracer: Add awsRequestId as annotation
    tracer.putAnnotation("awsRequestId", context.awsRequestId);
    // Metrics: Capture cold start metrics
    metrics.captureColdStartMetric();
    // Logger: Append awsRequestId to each log statement
    logger.appendKeys({
        awsRequestId: context.awsRequestId,
    });
    const eventIndex = event.Records.length - 1;
    if (event.Records[0].eventName === "MODIFY" &&
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
        const orderItems = event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
        let items = [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: 100,
                    product_data: {
                        name: "Test product",
                        description: "test products description",
                        images: [
                            "https://cdn.rebrickable.com/media/thumbs/sets/5006530-1/79749.jpg/1000x800p.jpg",
                        ],
                    },
                },
            },
        ];
        // const userId = event.Records[eventIndex].dynamodb?.NewImage?.id.S;
        logger.info("Order Items: ", { orderItems });
        const test = await sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
        })
            .promise();
        logger.info("Lambda invocation event", { test });
        return orderItems;
    }
    return event;
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtQ29uc3VtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJlYW1Db25zdW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdURBQXVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUd2RCw2Q0FBK0I7QUFDL0IsMERBQXVEO0FBQ3ZELDREQUF5RDtBQUN6RCwwREFBdUQ7QUFDdkQsd0VBQXdFO0FBQ3hFLG1DQUFtQztBQUNuQyw4REFBOEQ7QUFDOUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUM5Qiw2R0FBNkcsQ0FDOUcsQ0FBQztBQUNGLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLDZCQUE2QjtBQUM3QixtSEFBbUg7QUFDbkgsTUFBTTtBQUNOLHdCQUF3QjtBQUN4QixnQ0FBZ0M7QUFDaEMsTUFBTTtBQUNOLEtBQUs7QUFFTCxNQUFNLGFBQWEsR0FBRztJQUNwQixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksS0FBSztJQUN2QyxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxLQUFLO0NBQ3JELENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQztJQUN4Qix1QkFBdUIsRUFBRTtRQUN2QixHQUFHLGFBQWE7UUFDaEIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLCtCQUErQjtZQUNyQyxPQUFPLEVBQUUsb0JBQVU7U0FDcEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQztJQUMxQixpQkFBaUIsRUFBRSxhQUFhO0NBQ2pDLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7QUFFckIsS0FBSyxVQUFVLElBQUksQ0FDeEIsS0FBVSxFQUNWLE9BQWdCO0lBRWhCLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRWxELHNDQUFzQztJQUN0QyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUVqQyxvRUFBb0U7SUFDcEUsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFFbEMseUNBQXlDO0lBQ3pDLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzRCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsb0RBQW9EO0lBQ3BELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUNILE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QyxJQUNFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFFBQVE7UUFDdkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQ25FO1FBQ0EsTUFBTSxVQUFVLEdBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBSSxLQUFLLEdBQUc7WUFDVjtnQkFDRSxRQUFRLEVBQUUsQ0FBQztnQkFDWCxVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsV0FBVyxFQUFFLEdBQUc7b0JBQ2hCLFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsY0FBYzt3QkFDcEIsV0FBVyxFQUFFLDJCQUEyQjt3QkFDeEMsTUFBTSxFQUFFOzRCQUNOLGlGQUFpRjt5QkFDbEY7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7UUFFRixxRUFBcUU7UUFDckUsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRzthQUNuQixXQUFXLENBQUM7WUFDWCxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFtQjtZQUN6QyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7U0FDaEUsQ0FBQzthQUNELE9BQU8sRUFBRSxDQUFDO1FBRWIsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUE1REQsb0JBNERDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuXG5pbXBvcnQgeyBEeW5hbW9EQlN0cmVhbUV2ZW50LCBDb250ZXh0IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIEFXUyBmcm9tIFwiYXdzLXNka1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvbG9nZ2VyXCI7XG5pbXBvcnQgeyBNZXRyaWNzIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvbWV0cmljc1wiO1xuaW1wb3J0IHsgVHJhY2VyIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvdHJhY2VyXCI7XG5pbXBvcnQgeyBQVF9WRVJTSU9OIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvY29tbW9ucy9saWIvdmVyc2lvblwiO1xuLy8gaW1wb3J0IHsgU3RyaXBlIH0gZnJvbSBcInN0cmlwZVwiO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbmNvbnN0IFN0cmlwZSA9IHJlcXVpcmUoXCJzdHJpcGVcIikoXG4gIFwic2tfdGVzdF81MU5WSjRSRUNwVGpKUlJDb2Rtc3lNSUs2MTN2YkswRWxoeVV3TVJlc3p6eDZxczhGelpRRGRpOFZ0WjVEallrbjVnTlFyeWpURE1Oa2YwMVFMS1Z3eHdUUDAwRFQ4SGF2TkxcIlxuKTtcbmNvbnN0IHNxcyA9IG5ldyBBV1MuU1FTKCk7XG4vLyBjb25zdCBzdHJpcGUgPSBuZXcgU3RyaXBlKFxuLy8gICBcInNrX3Rlc3RfNTFOVko0UkVDcFRqSlJSQ29kbXN5TUlLNjEzdmJLMEVsaHlVd01SZXN6eng2cXM4RnpaUURkaThWdFo1RGpZa241Z05RcnlqVERNTmtmMDFRTEtWd3h3VFAwMERUOEhhdk5MXCIsXG4vLyAgIHtcbi8vICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuLy8gICAgIGFwaVZlcnNpb246IFwiMjAyMy0xMC0xNlwiLFxuLy8gICB9XG4vLyApO1xuXG5jb25zdCBkZWZhdWx0VmFsdWVzID0ge1xuICByZWdpb246IHByb2Nlc3MuZW52LkFXU19SRUdJT04gfHwgXCJOL0FcIixcbiAgZXhlY3V0aW9uRW52OiBwcm9jZXNzLmVudi5BV1NfRVhFQ1VUSU9OX0VOViB8fCBcIk4vQVwiLFxufTtcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7XG4gIHBlcnNpc3RlbnRMb2dBdHRyaWJ1dGVzOiB7XG4gICAgLi4uZGVmYXVsdFZhbHVlcyxcbiAgICBsb2dnZXI6IHtcbiAgICAgIG5hbWU6IFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9sb2dnZXJcIixcbiAgICAgIHZlcnNpb246IFBUX1ZFUlNJT04sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBtZXRyaWNzID0gbmV3IE1ldHJpY3Moe1xuICBkZWZhdWx0RGltZW5zaW9uczogZGVmYXVsdFZhbHVlcyxcbn0pO1xuXG5jb25zdCB0cmFjZXIgPSBuZXcgVHJhY2VyKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKFxuICBldmVudDogYW55LFxuICBjb250ZXh0OiBDb250ZXh0XG4pOiBQcm9taXNlPER5bmFtb0RCU3RyZWFtRXZlbnQ+IHtcbiAgbG9nZ2VyLmluZm8oXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IGV2ZW50IH0pO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIFRyYWNlcjogQW5ub3RhdGUgdGhlIHN1YnNlZ21lbnQgd2l0aCB0aGUgY29sZCBzdGFydCAmIHNlcnZpY2VOYW1lXG4gIHRyYWNlci5hbm5vdGF0ZUNvbGRTdGFydCgpO1xuICB0cmFjZXIuYWRkU2VydmljZU5hbWVBbm5vdGF0aW9uKCk7XG5cbiAgLy8gVHJhY2VyOiBBZGQgYXdzUmVxdWVzdElkIGFzIGFubm90YXRpb25cbiAgdHJhY2VyLnB1dEFubm90YXRpb24oXCJhd3NSZXF1ZXN0SWRcIiwgY29udGV4dC5hd3NSZXF1ZXN0SWQpO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIExvZ2dlcjogQXBwZW5kIGF3c1JlcXVlc3RJZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoe1xuICAgIGF3c1JlcXVlc3RJZDogY29udGV4dC5hd3NSZXF1ZXN0SWQsXG4gIH0pO1xuICBjb25zdCBldmVudEluZGV4ID0gZXZlbnQuUmVjb3Jkcy5sZW5ndGggLSAxO1xuICBpZiAoXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5ldmVudE5hbWUgPT09IFwiTU9ESUZZXCIgJiZcbiAgICBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uU0suUz8uc2xpY2UoMCwgNikgPT09IFwiT1JERVIjXCJcbiAgKSB7XG4gICAgY29uc3Qgb3JkZXJJdGVtcyA9XG4gICAgICBldmVudC5SZWNvcmRzW2V2ZW50SW5kZXhdLmR5bmFtb2RiPy5OZXdJbWFnZT8ub3JkZXJJdGVtcz8uTDtcbiAgICBsZXQgaXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICBwcmljZV9kYXRhOiB7XG4gICAgICAgICAgY3VycmVuY3k6IFwidXNkXCIsXG4gICAgICAgICAgdW5pdF9hbW91bnQ6IDEwMCxcbiAgICAgICAgICBwcm9kdWN0X2RhdGE6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiVGVzdCBwcm9kdWN0XCIsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJ0ZXN0IHByb2R1Y3RzIGRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcbiAgICAgICAgICAgICAgXCJodHRwczovL2Nkbi5yZWJyaWNrYWJsZS5jb20vbWVkaWEvdGh1bWJzL3NldHMvNTAwNjUzMC0xLzc5NzQ5LmpwZy8xMDAweDgwMHAuanBnXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF07XG5cbiAgICAvLyBjb25zdCB1c2VySWQgPSBldmVudC5SZWNvcmRzW2V2ZW50SW5kZXhdLmR5bmFtb2RiPy5OZXdJbWFnZT8uaWQuUztcbiAgICBsb2dnZXIuaW5mbyhcIk9yZGVyIEl0ZW1zOiBcIiwgeyBvcmRlckl0ZW1zIH0pO1xuICAgIGNvbnN0IHRlc3QgPSBhd2FpdCBzcXNcbiAgICAgIC5zZW5kTWVzc2FnZSh7XG4gICAgICAgIFF1ZXVlVXJsOiBwcm9jZXNzLmVudi5RVUVVRV9VUkwgYXMgc3RyaW5nLFxuICAgICAgICBNZXNzYWdlQm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYi5OZXdJbWFnZSksXG4gICAgICB9KVxuICAgICAgLnByb21pc2UoKTtcblxuICAgIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyB0ZXN0IH0pO1xuICAgIHJldHVybiBvcmRlckl0ZW1zO1xuICB9XG4gIHJldHVybiBldmVudDtcbn1cbiJdfQ==