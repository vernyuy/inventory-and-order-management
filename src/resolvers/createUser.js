"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const utils_1 = require("@aws-appsync/utils");
const helpers_1 = require("../lib/helpers");
function request(ctx) {
    // add timestamps
    const user = (0, helpers_1.createItem)(ctx.args.input);
    const id = utils_1.util.autoId();
    // const key = {
    //   PK: `USER#${id}`,
    //   SK: `USER#${id}`,
    // };
    // const item = { ...user };
    // item.typeName = "Inventory";
    // item.GSI2PK = "INVENTORY";
    // item.GSI1SK = "INVENTORY#" + inventoryId;
    // item.GSI1PK = "INVENTORY#" + inventoryId;
    // item.CreatedOn = util.time.nowEpochMilliSeconds();
    // item.UpdatedOn = util.time.nowEpochMilliSeconds();
    // return put({
    //   key,
    //   item: {...user},
    // });
    return {
        operation: "PutItem",
        key: {
            PK: utils_1.util.dynamodb.toDynamoDB(`USER#${id}`),
            SK: utils_1.util.dynamodb.toDynamoDB(`USER#${id}`),
        },
        attributeValues: utils_1.util.dynamodb.toMapValues({
            publishDate: utils_1.util.time.nowISO8601(),
            ...user,
            GSI1PK: `USER`,
            GSI1SK: `USER#${id}`,
        }),
    };
}
exports.request = request;
function response(ctx) {
    console.log("CREATED USER", ctx.result);
    return ctx.result;
}
exports.response = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQTJFO0FBQzNFLDRDQUE0QztBQUk1QyxTQUFnQixPQUFPLENBQ3JCLEdBQW9DO0lBRXBDLGlCQUFpQjtJQUNqQixNQUFNLElBQUksR0FBRyxJQUFBLG9CQUFVLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxNQUFNLEVBQUUsR0FBRyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFekIsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0QixzQkFBc0I7SUFDdEIsS0FBSztJQUNMLDRCQUE0QjtJQUM1QiwrQkFBK0I7SUFDL0IsNkJBQTZCO0lBQzdCLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMscURBQXFEO0lBQ3JELHFEQUFxRDtJQUVyRCxlQUFlO0lBQ2YsU0FBUztJQUNULHFCQUFxQjtJQUNyQixNQUFNO0lBQ04sT0FBTztRQUNMLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLEdBQUcsRUFBRTtZQUNILEVBQUUsRUFBRSxZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsRUFBRSxZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsZUFBZSxFQUFFLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3pDLFdBQVcsRUFBRSxZQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQyxHQUFHLElBQUk7WUFDUCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRTtTQUNyQixDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUM7QUFwQ0QsMEJBb0NDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLEdBQTBDO0lBQ2pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDcEIsQ0FBQztBQUhELDRCQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udGV4dCwgRHluYW1vREJQdXRJdGVtUmVxdWVzdCwgdXRpbCB9IGZyb20gXCJAYXdzLWFwcHN5bmMvdXRpbHNcIjtcbmltcG9ydCB7IGNyZWF0ZUl0ZW0gfSBmcm9tIFwiLi4vbGliL2hlbHBlcnNcIjtcbmltcG9ydCB7IE11dGF0aW9uQ3JlYXRlVXNlckFyZ3MsIFVzZXIgfSBmcm9tIFwiLi4vdHlwZXMvYXBwc3luY1wiO1xuaW1wb3J0IHsgcHV0IH0gZnJvbSBcIkBhd3MtYXBwc3luYy91dGlscy9keW5hbW9kYlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdChcbiAgY3R4OiBDb250ZXh0PE11dGF0aW9uQ3JlYXRlVXNlckFyZ3M+XG4pOiBEeW5hbW9EQlB1dEl0ZW1SZXF1ZXN0IHtcbiAgLy8gYWRkIHRpbWVzdGFtcHNcbiAgY29uc3QgdXNlciA9IGNyZWF0ZUl0ZW0oY3R4LmFyZ3MuaW5wdXQpO1xuICBjb25zdCBpZCA9IHV0aWwuYXV0b0lkKCk7XG5cbiAgLy8gY29uc3Qga2V5ID0ge1xuICAvLyAgIFBLOiBgVVNFUiMke2lkfWAsXG4gIC8vICAgU0s6IGBVU0VSIyR7aWR9YCxcbiAgLy8gfTtcbiAgLy8gY29uc3QgaXRlbSA9IHsgLi4udXNlciB9O1xuICAvLyBpdGVtLnR5cGVOYW1lID0gXCJJbnZlbnRvcnlcIjtcbiAgLy8gaXRlbS5HU0kyUEsgPSBcIklOVkVOVE9SWVwiO1xuICAvLyBpdGVtLkdTSTFTSyA9IFwiSU5WRU5UT1JZI1wiICsgaW52ZW50b3J5SWQ7XG4gIC8vIGl0ZW0uR1NJMVBLID0gXCJJTlZFTlRPUlkjXCIgKyBpbnZlbnRvcnlJZDtcbiAgLy8gaXRlbS5DcmVhdGVkT24gPSB1dGlsLnRpbWUubm93RXBvY2hNaWxsaVNlY29uZHMoKTtcbiAgLy8gaXRlbS5VcGRhdGVkT24gPSB1dGlsLnRpbWUubm93RXBvY2hNaWxsaVNlY29uZHMoKTtcblxuICAvLyByZXR1cm4gcHV0KHtcbiAgLy8gICBrZXksXG4gIC8vICAgaXRlbTogey4uLnVzZXJ9LFxuICAvLyB9KTtcbiAgcmV0dXJuIHtcbiAgICBvcGVyYXRpb246IFwiUHV0SXRlbVwiLFxuICAgIGtleToge1xuICAgICAgUEs6IHV0aWwuZHluYW1vZGIudG9EeW5hbW9EQihgVVNFUiMke2lkfWApLFxuICAgICAgU0s6IHV0aWwuZHluYW1vZGIudG9EeW5hbW9EQihgVVNFUiMke2lkfWApLFxuICAgIH0sXG4gICAgYXR0cmlidXRlVmFsdWVzOiB1dGlsLmR5bmFtb2RiLnRvTWFwVmFsdWVzKHtcbiAgICAgIHB1Ymxpc2hEYXRlOiB1dGlsLnRpbWUubm93SVNPODYwMSgpLFxuICAgICAgLi4udXNlcixcbiAgICAgIEdTSTFQSzogYFVTRVJgLFxuICAgICAgR1NJMVNLOiBgVVNFUiMke2lkfWAsXG4gICAgfSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNwb25zZShjdHg6IENvbnRleHQ8TXV0YXRpb25DcmVhdGVVc2VyQXJncywgVXNlcj4pIHtcbiAgY29uc29sZS5sb2coXCJDUkVBVEVEIFVTRVJcIiwgY3R4LnJlc3VsdCk7XG4gIHJldHVybiBjdHgucmVzdWx0O1xufVxuIl19