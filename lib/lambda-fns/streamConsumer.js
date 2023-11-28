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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const AWS = __importStar(require("aws-sdk"));
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const tracer_1 = require("@aws-lambda-powertools/tracer");
const version_1 = require("@aws-lambda-powertools/commons/lib/version");
const stripe_1 = __importDefault(require("stripe"));
const sqs = new AWS.SQS();
const stripe = new stripe_1.default("sk_test_51NVJ4RECpTjJRRCodmsyMIK613vbK0ElhyUwMReszzx6qs8FzZQDdi8VtZ5DjYkn5gNQryjTDMNkf01QLKVwxwTP00DT8HavNL", {
    typescript: true,
    apiVersion: "2023-08-16",
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtQ29uc3VtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJlYW1Db25zdW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdURBQXVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUd2RCw2Q0FBK0I7QUFDL0IsMERBQXVEO0FBQ3ZELDREQUF5RDtBQUN6RCwwREFBdUQ7QUFDdkQsd0VBQXdFO0FBQ3hFLG9EQUE0QjtBQUU1QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQ3ZCLDZHQUE2RyxFQUM3RztJQUNFLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxZQUFZO0NBQ3pCLENBQ0YsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxLQUFLO0lBQ3ZDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLEtBQUs7Q0FDckQsQ0FBQztBQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDO0lBQ3hCLHVCQUF1QixFQUFFO1FBQ3ZCLEdBQUcsYUFBYTtRQUNoQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsK0JBQStCO1lBQ3JDLE9BQU8sRUFBRSxvQkFBVTtTQUNwQjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDO0lBQzFCLGlCQUFpQixFQUFFLGFBQWE7Q0FDakMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztBQUVyQixLQUFLLFVBQVUsSUFBSSxDQUN4QixLQUFVLEVBQ1YsT0FBZ0I7SUFFaEIsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbEQsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBRWpDLG9FQUFvRTtJQUNwRSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUVsQyx5Q0FBeUM7SUFDekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTNELHNDQUFzQztJQUN0QyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUVqQyxvREFBb0Q7SUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNoQixZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7S0FDbkMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUTtRQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFDbkU7UUFDQSxNQUFNLFVBQVUsR0FDZCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM5RCxJQUFJLEtBQUssR0FBRztZQUNWO2dCQUNFLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUUsS0FBSztvQkFDZixXQUFXLEVBQUUsR0FBRztvQkFDaEIsWUFBWSxFQUFFO3dCQUNaLElBQUksRUFBRSxjQUFjO3dCQUNwQixXQUFXLEVBQUUsMkJBQTJCO3dCQUN4QyxNQUFNLEVBQUU7NEJBQ04saUZBQWlGO3lCQUNsRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLHFFQUFxRTtRQUNyRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHO2FBQ25CLFdBQVcsQ0FBQztZQUNYLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQW1CO1lBQ3pDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztTQUNoRSxDQUFDO2FBQ0QsT0FBTyxFQUFFLENBQUM7UUFFYixNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQztLQUNuQjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQTVERCxvQkE0REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5cbmltcG9ydCB7IER5bmFtb0RCU3RyZWFtRXZlbnQsIENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9sb2dnZXJcIjtcbmltcG9ydCB7IE1ldHJpY3MgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9tZXRyaWNzXCI7XG5pbXBvcnQgeyBUcmFjZXIgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy90cmFjZXJcIjtcbmltcG9ydCB7IFBUX1ZFUlNJT04gfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9jb21tb25zL2xpYi92ZXJzaW9uXCI7XG5pbXBvcnQgU3RyaXBlIGZyb20gXCJzdHJpcGVcIjtcblxuY29uc3Qgc3FzID0gbmV3IEFXUy5TUVMoKTtcbmNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUoXG4gIFwic2tfdGVzdF81MU5WSjRSRUNwVGpKUlJDb2Rtc3lNSUs2MTN2YkswRWxoeVV3TVJlc3p6eDZxczhGelpRRGRpOFZ0WjVEallrbjVnTlFyeWpURE1Oa2YwMVFMS1Z3eHdUUDAwRFQ4SGF2TkxcIixcbiAge1xuICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgYXBpVmVyc2lvbjogXCIyMDIzLTA4LTE2XCIsXG4gIH1cbik7XG5cbmNvbnN0IGRlZmF1bHRWYWx1ZXMgPSB7XG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiB8fCBcIk4vQVwiLFxuICBleGVjdXRpb25FbnY6IHByb2Nlc3MuZW52LkFXU19FWEVDVVRJT05fRU5WIHx8IFwiTi9BXCIsXG59O1xuXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAgcGVyc2lzdGVudExvZ0F0dHJpYnV0ZXM6IHtcbiAgICAuLi5kZWZhdWx0VmFsdWVzLFxuICAgIGxvZ2dlcjoge1xuICAgICAgbmFtZTogXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2xvZ2dlclwiLFxuICAgICAgdmVyc2lvbjogUFRfVkVSU0lPTixcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IG1ldHJpY3MgPSBuZXcgTWV0cmljcyh7XG4gIGRlZmF1bHREaW1lbnNpb25zOiBkZWZhdWx0VmFsdWVzLFxufSk7XG5cbmNvbnN0IHRyYWNlciA9IG5ldyBUcmFjZXIoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4oXG4gIGV2ZW50OiBhbnksXG4gIGNvbnRleHQ6IENvbnRleHRcbik6IFByb21pc2U8RHluYW1vREJTdHJlYW1FdmVudD4ge1xuICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgZXZlbnQgfSk7XG5cbiAgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcbiAgbWV0cmljcy5jYXB0dXJlQ29sZFN0YXJ0TWV0cmljKCk7XG5cbiAgLy8gVHJhY2VyOiBBbm5vdGF0ZSB0aGUgc3Vic2VnbWVudCB3aXRoIHRoZSBjb2xkIHN0YXJ0ICYgc2VydmljZU5hbWVcbiAgdHJhY2VyLmFubm90YXRlQ29sZFN0YXJ0KCk7XG4gIHRyYWNlci5hZGRTZXJ2aWNlTmFtZUFubm90YXRpb24oKTtcblxuICAvLyBUcmFjZXI6IEFkZCBhd3NSZXF1ZXN0SWQgYXMgYW5ub3RhdGlvblxuICB0cmFjZXIucHV0QW5ub3RhdGlvbihcImF3c1JlcXVlc3RJZFwiLCBjb250ZXh0LmF3c1JlcXVlc3RJZCk7XG5cbiAgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcbiAgbWV0cmljcy5jYXB0dXJlQ29sZFN0YXJ0TWV0cmljKCk7XG5cbiAgLy8gTG9nZ2VyOiBBcHBlbmQgYXdzUmVxdWVzdElkIHRvIGVhY2ggbG9nIHN0YXRlbWVudFxuICBsb2dnZXIuYXBwZW5kS2V5cyh7XG4gICAgYXdzUmVxdWVzdElkOiBjb250ZXh0LmF3c1JlcXVlc3RJZCxcbiAgfSk7XG4gIGNvbnN0IGV2ZW50SW5kZXggPSBldmVudC5SZWNvcmRzLmxlbmd0aCAtIDE7XG4gIGlmIChcbiAgICBldmVudC5SZWNvcmRzWzBdLmV2ZW50TmFtZSA9PT0gXCJNT0RJRllcIiAmJlxuICAgIGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5TSy5TPy5zbGljZSgwLCA2KSA9PT0gXCJPUkRFUiNcIlxuICApIHtcbiAgICBjb25zdCBvcmRlckl0ZW1zID1cbiAgICAgIGV2ZW50LlJlY29yZHNbZXZlbnRJbmRleF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5vcmRlckl0ZW1zPy5MO1xuICAgIGxldCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgIHByaWNlX2RhdGE6IHtcbiAgICAgICAgICBjdXJyZW5jeTogXCJ1c2RcIixcbiAgICAgICAgICB1bml0X2Ftb3VudDogMTAwLFxuICAgICAgICAgIHByb2R1Y3RfZGF0YToge1xuICAgICAgICAgICAgbmFtZTogXCJUZXN0IHByb2R1Y3RcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInRlc3QgcHJvZHVjdHMgZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgIGltYWdlczogW1xuICAgICAgICAgICAgICBcImh0dHBzOi8vY2RuLnJlYnJpY2thYmxlLmNvbS9tZWRpYS90aHVtYnMvc2V0cy81MDA2NTMwLTEvNzk3NDkuanBnLzEwMDB4ODAwcC5qcGdcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcblxuICAgIC8vIGNvbnN0IHVzZXJJZCA9IGV2ZW50LlJlY29yZHNbZXZlbnRJbmRleF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5pZC5TO1xuICAgIGxvZ2dlci5pbmZvKFwiT3JkZXIgSXRlbXM6IFwiLCB7IG9yZGVySXRlbXMgfSk7XG4gICAgY29uc3QgdGVzdCA9IGF3YWl0IHNxc1xuICAgICAgLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgUXVldWVVcmw6IHByb2Nlc3MuZW52LlFVRVVFX1VSTCBhcyBzdHJpbmcsXG4gICAgICAgIE1lc3NhZ2VCb2R5OiBKU09OLnN0cmluZ2lmeShldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiLk5ld0ltYWdlKSxcbiAgICAgIH0pXG4gICAgICAucHJvbWlzZSgpO1xuXG4gICAgbG9nZ2VyLmluZm8oXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IHRlc3QgfSk7XG4gICAgcmV0dXJuIG9yZGVySXRlbXM7XG4gIH1cbiAgcmV0dXJuIGV2ZW50O1xufVxuIl19