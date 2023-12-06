"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const aws_sdk_1 = require("aws-sdk");
const batch_1 = require("@aws-lambda-powertools/batch");
const utils_1 = require("./utils");
const ddbClient = new aws_sdk_1.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
const processor = new batch_1.BatchProcessor(batch_1.EventType.SQS);
const recordHandler = async (record) => {
    const payload = record.body;
    if (payload) {
        const order = JSON.parse(payload);
        console.log("Processed item", { order });
        const userId = order.PK.S;
        for (const item of order.orderItems.L) {
            console.log(item);
            const element = item.M.SK;
            const params = {
                TableName: tableName,
                Key: {
                    PK: `${userId}`,
                    SK: `${element.S}`,
                },
                UpdateExpression: "set cartProductStatus = :status, UpdateOn = :Updated",
                ExpressionAttributeValues: {
                    ":status": "ORDERED",
                    ":Updated": Date.now().toString(),
                },
                ReturnValues: "UPDATED_NEW",
            };
            try {
                const res = await ddbClient.update(params).promise();
                console.log("Response", { res });
            }
            catch (err) {
                utils_1.logger.info("Error: ", { err });
            }
        }
    }
};
const main = async (event, context) => {
    return (0, batch_1.processPartialResponse)(event, recordHandler, processor, {
        context,
    });
};
exports.main = main;
// export async function main(event: SQSEvent): Promise<SQSEvent> {
//   console.log("Evnt", event);
//   const records = event.Records;
//   const order = JSON.parse(records[0].body);
//   const userId = order.PK.S;
//   for (const item of order.orderItems.L) {
//     console.log(item);
//     const element = item.M.SK;
//     const params = {
//       TableName: tableName,
//       Key: {
//         PK: `${userId}`,
//         SK: `${element.S}`,
//       },
//       UpdateExpression: "set cartProductStatus = :status, UpdateOn = :Updated",
//       ExpressionAttributeValues: {
//         ":status": "ORDERED",
//         ":Updated": Date.now().toString(),
//       },
//       ReturnValues: "UPDATED_NEW",
//     };
//     try {
//       const res = await ddbClient.update(params).promise();
//       console.log("Response", { res });
//     } catch (err: unknown) {
//       // logger.info("Error: ", { err });
//     }
//   }
//   return event;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWVDb25zdW1lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF1ZXVlQ29uc3VtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQW1DO0FBRW5DLHdEQUlzQztBQUN0QyxtQ0FBa0Q7QUFFbEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2hELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBb0IsQ0FBQztBQUNuRCxNQUFNLFNBQVMsR0FBRyxJQUFJLHNCQUFjLENBQUMsaUJBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQUUsTUFBaUIsRUFBaUIsRUFBRTtJQUMvRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzVCLElBQUksT0FBTyxFQUFFO1FBQ1gsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDMUIsTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLEdBQUcsRUFBRTtvQkFDSCxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUU7b0JBQ2YsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRTtpQkFDbkI7Z0JBQ0QsZ0JBQWdCLEVBQ2Qsc0RBQXNEO2dCQUN4RCx5QkFBeUIsRUFBRTtvQkFDekIsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO2lCQUNsQztnQkFDRCxZQUFZLEVBQUUsYUFBYTthQUM1QixDQUFDO1lBQ0YsSUFBSTtnQkFDRixNQUFNLEdBQUcsR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUNsQztZQUFDLE9BQU8sR0FBWSxFQUFFO2dCQUNyQixjQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDakM7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxDQUFDO0FBRUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixLQUFlLEVBQ2YsT0FBZ0IsRUFDVyxFQUFFO0lBQzdCLE9BQU8sSUFBQSw4QkFBc0IsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRTtRQUM3RCxPQUFPO0tBQ1IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBUFcsUUFBQSxJQUFJLFFBT2Y7QUFFRixtRUFBbUU7QUFDbkUsZ0NBQWdDO0FBQ2hDLG1DQUFtQztBQUNuQywrQ0FBK0M7QUFDL0MsK0JBQStCO0FBRS9CLDZDQUE2QztBQUM3Qyx5QkFBeUI7QUFDekIsaUNBQWlDO0FBQ2pDLHVCQUF1QjtBQUN2Qiw4QkFBOEI7QUFDOUIsZUFBZTtBQUNmLDJCQUEyQjtBQUMzQiw4QkFBOEI7QUFDOUIsV0FBVztBQUNYLGtGQUFrRjtBQUNsRixxQ0FBcUM7QUFDckMsZ0NBQWdDO0FBQ2hDLDZDQUE2QztBQUM3QyxXQUFXO0FBQ1gscUNBQXFDO0FBQ3JDLFNBQVM7QUFDVCxZQUFZO0FBQ1osOERBQThEO0FBQzlELDBDQUEwQztBQUMxQywrQkFBK0I7QUFDL0IsNENBQTRDO0FBQzVDLFFBQVE7QUFDUixNQUFNO0FBQ04sa0JBQWtCO0FBQ2xCLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTUVNFdmVudCwgU1FTUmVjb3JkLCBDb250ZXh0LCBTUVNCYXRjaFJlc3BvbnNlIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCB7IER5bmFtb0RCIH0gZnJvbSBcImF3cy1zZGtcIjtcblxuaW1wb3J0IHtcbiAgQmF0Y2hQcm9jZXNzb3IsXG4gIEV2ZW50VHlwZSxcbiAgcHJvY2Vzc1BhcnRpYWxSZXNwb25zZSxcbn0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvYmF0Y2hcIjtcbmltcG9ydCB7IGxvZ2dlciwgbWV0cmljcywgdHJhY2VyIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY29uc3QgZGRiQ2xpZW50ID0gbmV3IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCB0YWJsZU5hbWUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIGFzIHN0cmluZztcbmNvbnN0IHByb2Nlc3NvciA9IG5ldyBCYXRjaFByb2Nlc3NvcihFdmVudFR5cGUuU1FTKTtcbmNvbnN0IHJlY29yZEhhbmRsZXIgPSBhc3luYyAocmVjb3JkOiBTUVNSZWNvcmQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgcGF5bG9hZCA9IHJlY29yZC5ib2R5O1xuICBpZiAocGF5bG9hZCkge1xuICAgIGNvbnN0IG9yZGVyID0gSlNPTi5wYXJzZShwYXlsb2FkKTtcblxuICAgIGNvbnNvbGUubG9nKFwiUHJvY2Vzc2VkIGl0ZW1cIiwgeyBvcmRlciB9KTtcbiAgICBjb25zdCB1c2VySWQgPSBvcmRlci5QSy5TO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBvcmRlci5vcmRlckl0ZW1zLkwpIHtcbiAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgY29uc3QgZWxlbWVudCA9IGl0ZW0uTS5TSztcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgICAgIEtleToge1xuICAgICAgICAgIFBLOiBgJHt1c2VySWR9YCxcbiAgICAgICAgICBTSzogYCR7ZWxlbWVudC5TfWAsXG4gICAgICAgIH0sXG4gICAgICAgIFVwZGF0ZUV4cHJlc3Npb246XG4gICAgICAgICAgXCJzZXQgY2FydFByb2R1Y3RTdGF0dXMgPSA6c3RhdHVzLCBVcGRhdGVPbiA9IDpVcGRhdGVkXCIsXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICBcIjpzdGF0dXNcIjogXCJPUkRFUkVEXCIsXG4gICAgICAgICAgXCI6VXBkYXRlZFwiOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksXG4gICAgICAgIH0sXG4gICAgICAgIFJldHVyblZhbHVlczogXCJVUERBVEVEX05FV1wiLFxuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGRkYkNsaWVudC51cGRhdGUocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2VcIiwgeyByZXMgfSk7XG4gICAgICB9IGNhdGNoIChlcnI6IHVua25vd24pIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJFcnJvcjogXCIsIHsgZXJyIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoXG4gIGV2ZW50OiBTUVNFdmVudCxcbiAgY29udGV4dDogQ29udGV4dFxuKTogUHJvbWlzZTxTUVNCYXRjaFJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwcm9jZXNzUGFydGlhbFJlc3BvbnNlKGV2ZW50LCByZWNvcmRIYW5kbGVyLCBwcm9jZXNzb3IsIHtcbiAgICBjb250ZXh0LFxuICB9KTtcbn07XG5cbi8vIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKGV2ZW50OiBTUVNFdmVudCk6IFByb21pc2U8U1FTRXZlbnQ+IHtcbi8vICAgY29uc29sZS5sb2coXCJFdm50XCIsIGV2ZW50KTtcbi8vICAgY29uc3QgcmVjb3JkcyA9IGV2ZW50LlJlY29yZHM7XG4vLyAgIGNvbnN0IG9yZGVyID0gSlNPTi5wYXJzZShyZWNvcmRzWzBdLmJvZHkpO1xuLy8gICBjb25zdCB1c2VySWQgPSBvcmRlci5QSy5TO1xuXG4vLyAgIGZvciAoY29uc3QgaXRlbSBvZiBvcmRlci5vcmRlckl0ZW1zLkwpIHtcbi8vICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbi8vICAgICBjb25zdCBlbGVtZW50ID0gaXRlbS5NLlNLO1xuLy8gICAgIGNvbnN0IHBhcmFtcyA9IHtcbi8vICAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuLy8gICAgICAgS2V5OiB7XG4vLyAgICAgICAgIFBLOiBgJHt1c2VySWR9YCxcbi8vICAgICAgICAgU0s6IGAke2VsZW1lbnQuU31gLFxuLy8gICAgICAgfSxcbi8vICAgICAgIFVwZGF0ZUV4cHJlc3Npb246IFwic2V0IGNhcnRQcm9kdWN0U3RhdHVzID0gOnN0YXR1cywgVXBkYXRlT24gPSA6VXBkYXRlZFwiLFxuLy8gICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuLy8gICAgICAgICBcIjpzdGF0dXNcIjogXCJPUkRFUkVEXCIsXG4vLyAgICAgICAgIFwiOlVwZGF0ZWRcIjogRGF0ZS5ub3coKS50b1N0cmluZygpLFxuLy8gICAgICAgfSxcbi8vICAgICAgIFJldHVyblZhbHVlczogXCJVUERBVEVEX05FV1wiLFxuLy8gICAgIH07XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGRkYkNsaWVudC51cGRhdGUocGFyYW1zKS5wcm9taXNlKCk7XG4vLyAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlXCIsIHsgcmVzIH0pO1xuLy8gICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xuLy8gICAgICAgLy8gbG9nZ2VyLmluZm8oXCJFcnJvcjogXCIsIHsgZXJyIH0pO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gICByZXR1cm4gZXZlbnQ7XG4vLyB9XG4iXX0=