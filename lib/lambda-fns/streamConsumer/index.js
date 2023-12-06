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
const utils_1 = require("../utils");
const secrets_1 = require("@aws-lambda-powertools/parameters/secrets");
const stripe_1 = __importDefault(require("stripe"));
const sqs = new AWS.SQS();
async function main(event, context) {
    const stripeSecretKey = await (0, secrets_1.getSecret)("STRIPE_SECRET_KEY");
    console.log(stripeSecretKey);
    const stripe = new stripe_1.default(stripeSecretKey, {
        typescript: true,
        apiVersion: "2023-10-16",
    });
    utils_1.logger.info("Lambda invocation event", { event });
    utils_1.metrics.captureColdStartMetric(); // Metrics: Capture cold start metrics
    utils_1.tracer.annotateColdStart(); // Tracer: Annotate the subsegment with the cold start & serviceName
    utils_1.tracer.addServiceNameAnnotation();
    utils_1.tracer.putAnnotation("awsRequestId", context.awsRequestId); // Tracer: Add awsRequestId as annotation
    utils_1.metrics.captureColdStartMetric(); // Metrics: Capture cold start metrics
    utils_1.logger.appendKeys({
        // Logger: Append awsRequestId to each log statement
        awsRequestId: context.awsRequestId,
    });
    if (event.Records[0].eventName === "MODIFY" &&
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
        utils_1.logger.info("The required event emitted");
        const eventIndex = event.Records.length - 1;
        const itemLine = [];
        const orderItems = event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
        console.log(orderItems);
        for (const item of orderItems) {
            utils_1.logger.info("Item: ", item.M);
            const orderItem = {
                quantity: parseInt(item.M.quantity.N),
                price_data: {
                    currency: "usd",
                    unit_amount: parseFloat(item.M.unit_price.N) * 100,
                    product_data: {
                        name: "item.M.name.S",
                        description: "test products description",
                        images: ["item.M.image.S"],
                    },
                },
            };
            itemLine.push(orderItem);
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: itemLine,
            mode: "payment",
            success_url: "http://www.educloud.academy",
            customer_email: "body.email@gmail.com",
        });
        utils_1.logger.info("Session data for user line items and checkout link", {
            session,
        });
        utils_1.logger.info("Order Items: ", { orderItems });
        const test = await sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
        })
            .promise();
        utils_1.logger.info("Lambda invocation event", { test });
        // exec("google-chrome " + session.url);
        // return {
        //   status: "301",
        //   statusDescription: `Redirecting to apex domain`,
        //   headers: {
        //     location: [
        //       {
        //         key: "Location",
        //         value: session.url,
        //       },
        //     ],
        //   },
        // };
        return orderItems;
    }
    else {
        return event;
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdURBQXVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUd2RCw2Q0FBK0I7QUFDL0Isb0NBQW1EO0FBQ25ELHVFQUFzRTtBQUN0RSxvREFBNEI7QUFFNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFHbkIsS0FBSyxVQUFVLElBQUksQ0FDeEIsS0FBVSxFQUNWLE9BQWdCO0lBRWhCLE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBQSxtQkFBUyxFQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsZUFBeUIsRUFBRTtRQUNuRCxVQUFVLEVBQUUsSUFBSTtRQUNoQixVQUFVLEVBQUUsWUFBWTtLQUN6QixDQUFDLENBQUM7SUFFSCxjQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUVsRCxlQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLHNDQUFzQztJQUV4RSxjQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLG9FQUFvRTtJQUNoRyxjQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUVsQyxjQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7SUFFckcsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxzQ0FBc0M7SUFFeEUsY0FBTSxDQUFDLFVBQVUsQ0FBQztRQUNoQixvREFBb0Q7UUFDcEQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUNILElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUTtRQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFDbkU7UUFDQSxjQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDMUMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNwQixNQUFNLFVBQVUsR0FDZCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssTUFBTSxJQUFJLElBQUksVUFBVSxFQUFFO1lBQzdCLGNBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLFNBQVMsR0FBRztnQkFDaEIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUUsS0FBSztvQkFDZixXQUFXLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7b0JBQ2xELFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsZUFBZTt3QkFDckIsV0FBVyxFQUFFLDJCQUEyQjt3QkFDeEMsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7cUJBQzNCO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUI7UUFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNwRCxvQkFBb0IsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUM5QixVQUFVLEVBQUUsUUFBUTtZQUNwQixJQUFJLEVBQUUsU0FBUztZQUNmLFdBQVcsRUFBRSw2QkFBNkI7WUFDMUMsY0FBYyxFQUFFLHNCQUFzQjtTQUN2QyxDQUFDLENBQUM7UUFFSCxjQUFNLENBQUMsSUFBSSxDQUFDLG9EQUFvRCxFQUFFO1lBQ2hFLE9BQU87U0FDUixDQUFDLENBQUM7UUFFSCxjQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHO2FBQ25CLFdBQVcsQ0FBQztZQUNYLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQW1CO1lBQ3pDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztTQUNoRSxDQUFDO2FBQ0QsT0FBTyxFQUFFLENBQUM7UUFFYixjQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNqRCx3Q0FBd0M7UUFDeEMsV0FBVztRQUNYLG1CQUFtQjtRQUNuQixxREFBcUQ7UUFDckQsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixVQUFVO1FBQ1YsMkJBQTJCO1FBQzNCLDhCQUE4QjtRQUM5QixXQUFXO1FBQ1gsU0FBUztRQUNULE9BQU87UUFDUCxLQUFLO1FBQ0wsT0FBTyxVQUFVLENBQUM7S0FDbkI7U0FBTTtRQUNMLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBNUZELG9CQTRGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cblxuaW1wb3J0IHsgRHluYW1vREJTdHJlYW1FdmVudCwgQ29udGV4dCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcbmltcG9ydCB7IGxvZ2dlciwgbWV0cmljcywgdHJhY2VyIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBnZXRTZWNyZXQgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9wYXJhbWV0ZXJzL3NlY3JldHNcIjtcbmltcG9ydCBTdHJpcGUgZnJvbSBcInN0cmlwZVwiO1xuXG5jb25zdCBzcXMgPSBuZXcgQVdTLlNRUygpO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKFxuICBldmVudDogYW55LFxuICBjb250ZXh0OiBDb250ZXh0XG4pOiBQcm9taXNlPER5bmFtb0RCU3RyZWFtRXZlbnQ+IHtcbiAgY29uc3Qgc3RyaXBlU2VjcmV0S2V5ID0gYXdhaXQgZ2V0U2VjcmV0KFwiU1RSSVBFX1NFQ1JFVF9LRVlcIik7XG4gIGNvbnNvbGUubG9nKHN0cmlwZVNlY3JldEtleSk7XG4gIGNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUoc3RyaXBlU2VjcmV0S2V5IGFzIHN0cmluZywge1xuICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgYXBpVmVyc2lvbjogXCIyMDIzLTEwLTE2XCIsXG4gIH0pO1xuXG4gIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyBldmVudCB9KTtcblxuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTsgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcblxuICB0cmFjZXIuYW5ub3RhdGVDb2xkU3RhcnQoKTsgLy8gVHJhY2VyOiBBbm5vdGF0ZSB0aGUgc3Vic2VnbWVudCB3aXRoIHRoZSBjb2xkIHN0YXJ0ICYgc2VydmljZU5hbWVcbiAgdHJhY2VyLmFkZFNlcnZpY2VOYW1lQW5ub3RhdGlvbigpO1xuXG4gIHRyYWNlci5wdXRBbm5vdGF0aW9uKFwiYXdzUmVxdWVzdElkXCIsIGNvbnRleHQuYXdzUmVxdWVzdElkKTsgLy8gVHJhY2VyOiBBZGQgYXdzUmVxdWVzdElkIGFzIGFubm90YXRpb25cblxuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTsgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcblxuICBsb2dnZXIuYXBwZW5kS2V5cyh7XG4gICAgLy8gTG9nZ2VyOiBBcHBlbmQgYXdzUmVxdWVzdElkIHRvIGVhY2ggbG9nIHN0YXRlbWVudFxuICAgIGF3c1JlcXVlc3RJZDogY29udGV4dC5hd3NSZXF1ZXN0SWQsXG4gIH0pO1xuICBpZiAoXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5ldmVudE5hbWUgPT09IFwiTU9ESUZZXCIgJiZcbiAgICBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uU0suUz8uc2xpY2UoMCwgNikgPT09IFwiT1JERVIjXCJcbiAgKSB7XG4gICAgbG9nZ2VyLmluZm8oXCJUaGUgcmVxdWlyZWQgZXZlbnQgZW1pdHRlZFwiKTtcbiAgICBjb25zdCBldmVudEluZGV4ID0gZXZlbnQuUmVjb3Jkcy5sZW5ndGggLSAxO1xuICAgIGNvbnN0IGl0ZW1MaW5lID0gW107XG4gICAgY29uc3Qgb3JkZXJJdGVtcyA9XG4gICAgICBldmVudC5SZWNvcmRzW2V2ZW50SW5kZXhdLmR5bmFtb2RiPy5OZXdJbWFnZT8ub3JkZXJJdGVtcz8uTDtcbiAgICBjb25zb2xlLmxvZyhvcmRlckl0ZW1zKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygb3JkZXJJdGVtcykge1xuICAgICAgbG9nZ2VyLmluZm8oXCJJdGVtOiBcIiwgaXRlbS5NKTtcbiAgICAgIGNvbnN0IG9yZGVySXRlbSA9IHtcbiAgICAgICAgcXVhbnRpdHk6IHBhcnNlSW50KGl0ZW0uTS5xdWFudGl0eS5OKSxcbiAgICAgICAgcHJpY2VfZGF0YToge1xuICAgICAgICAgIGN1cnJlbmN5OiBcInVzZFwiLFxuICAgICAgICAgIHVuaXRfYW1vdW50OiBwYXJzZUZsb2F0KGl0ZW0uTS51bml0X3ByaWNlLk4pICogMTAwLFxuICAgICAgICAgIHByb2R1Y3RfZGF0YToge1xuICAgICAgICAgICAgbmFtZTogXCJpdGVtLk0ubmFtZS5TXCIsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJ0ZXN0IHByb2R1Y3RzIGRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIml0ZW0uTS5pbWFnZS5TXCJdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBpdGVtTGluZS5wdXNoKG9yZGVySXRlbSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHN0cmlwZS5jaGVja291dC5zZXNzaW9ucy5jcmVhdGUoe1xuICAgICAgcGF5bWVudF9tZXRob2RfdHlwZXM6IFtcImNhcmRcIl0sXG4gICAgICBsaW5lX2l0ZW1zOiBpdGVtTGluZSxcbiAgICAgIG1vZGU6IFwicGF5bWVudFwiLFxuICAgICAgc3VjY2Vzc191cmw6IFwiaHR0cDovL3d3dy5lZHVjbG91ZC5hY2FkZW15XCIsXG4gICAgICBjdXN0b21lcl9lbWFpbDogXCJib2R5LmVtYWlsQGdtYWlsLmNvbVwiLFxuICAgIH0pO1xuXG4gICAgbG9nZ2VyLmluZm8oXCJTZXNzaW9uIGRhdGEgZm9yIHVzZXIgbGluZSBpdGVtcyBhbmQgY2hlY2tvdXQgbGlua1wiLCB7XG4gICAgICBzZXNzaW9uLFxuICAgIH0pO1xuXG4gICAgbG9nZ2VyLmluZm8oXCJPcmRlciBJdGVtczogXCIsIHsgb3JkZXJJdGVtcyB9KTtcbiAgICBjb25zdCB0ZXN0ID0gYXdhaXQgc3FzXG4gICAgICAuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBRdWV1ZVVybDogcHJvY2Vzcy5lbnYuUVVFVUVfVVJMIGFzIHN0cmluZyxcbiAgICAgICAgTWVzc2FnZUJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGIuTmV3SW1hZ2UpLFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKCk7XG5cbiAgICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgdGVzdCB9KTtcbiAgICAvLyBleGVjKFwiZ29vZ2xlLWNocm9tZSBcIiArIHNlc3Npb24udXJsKTtcbiAgICAvLyByZXR1cm4ge1xuICAgIC8vICAgc3RhdHVzOiBcIjMwMVwiLFxuICAgIC8vICAgc3RhdHVzRGVzY3JpcHRpb246IGBSZWRpcmVjdGluZyB0byBhcGV4IGRvbWFpbmAsXG4gICAgLy8gICBoZWFkZXJzOiB7XG4gICAgLy8gICAgIGxvY2F0aW9uOiBbXG4gICAgLy8gICAgICAge1xuICAgIC8vICAgICAgICAga2V5OiBcIkxvY2F0aW9uXCIsXG4gICAgLy8gICAgICAgICB2YWx1ZTogc2Vzc2lvbi51cmwsXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgXSxcbiAgICAvLyAgIH0sXG4gICAgLy8gfTtcbiAgICByZXR1cm4gb3JkZXJJdGVtcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cbn1cbiJdfQ==