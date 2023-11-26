"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const utils_1 = require("@aws-appsync/utils");
const helpers_1 = require("../lib/helpers");
function request(ctx) {
    // add timestamps
    const item = (0, helpers_1.createItem)(ctx.args.input);
    const id = utils_1.util.autoId();
    return {
        operation: "PutItem",
        key: {
            PK: utils_1.util.dynamodb.toDynamoDB(item.employeeId),
            SK: utils_1.util.dynamodb.toDynamoDB("ITEM#" + id),
        },
        attributeValues: utils_1.util.dynamodb.toMapValues({
            publishDate: utils_1.util.time.nowISO8601(),
            ...item,
            UserInventoryIndexPK: item.inventoryId,
            UserInventoryIndexSK: `ITEM${id}`,
            InventoryItemIndexSK: "ITEM",
            InventoryItemIndexPK: `ITEM${id}`,
        }),
    };
}
exports.request = request;
function response(ctx) {
    return ctx.result;
}
exports.response = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZUl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQTJFO0FBQzNFLDRDQUE0QztBQUc1QyxTQUFnQixPQUFPLENBQ3JCLEdBQW9DO0lBRXBDLGlCQUFpQjtJQUNqQixNQUFNLElBQUksR0FBRyxJQUFBLG9CQUFVLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV4QyxNQUFNLEVBQUUsR0FBRyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFekIsT0FBTztRQUNMLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLEdBQUcsRUFBRTtZQUNILEVBQUUsRUFBRSxZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzdDLEVBQUUsRUFBRSxZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsZUFBZSxFQUFFLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3pDLFdBQVcsRUFBRSxZQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQyxHQUFHLElBQUk7WUFDUCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsV0FBVztZQUN0QyxvQkFBb0IsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNqQyxvQkFBb0IsRUFBRSxNQUFNO1lBQzVCLG9CQUFvQixFQUFFLE9BQU8sRUFBRSxFQUFFO1NBQ2xDLENBQUM7S0FDSCxDQUFDO0FBQ0osQ0FBQztBQXZCRCwwQkF1QkM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBa0I7SUFDekMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3BCLENBQUM7QUFGRCw0QkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIER5bmFtb0RCUHV0SXRlbVJlcXVlc3QsIHV0aWwgfSBmcm9tIFwiQGF3cy1hcHBzeW5jL3V0aWxzXCI7XG5pbXBvcnQgeyBjcmVhdGVJdGVtIH0gZnJvbSBcIi4uL2xpYi9oZWxwZXJzXCI7XG5pbXBvcnQgeyBNdXRhdGlvbkNyZWF0ZUl0ZW1BcmdzLCBJdGVtIH0gZnJvbSBcIi4uL3R5cGVzL2FwcHN5bmNcIjtcbmltcG9ydCAqIGFzIGRkYiBmcm9tIFwiQGF3cy1hcHBzeW5jL3V0aWxzL2R5bmFtb2RiXCI7XG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdChcbiAgY3R4OiBDb250ZXh0PE11dGF0aW9uQ3JlYXRlSXRlbUFyZ3M+XG4pOiBEeW5hbW9EQlB1dEl0ZW1SZXF1ZXN0IHtcbiAgLy8gYWRkIHRpbWVzdGFtcHNcbiAgY29uc3QgaXRlbSA9IGNyZWF0ZUl0ZW0oY3R4LmFyZ3MuaW5wdXQpO1xuXG4gIGNvbnN0IGlkID0gdXRpbC5hdXRvSWQoKTtcblxuICByZXR1cm4ge1xuICAgIG9wZXJhdGlvbjogXCJQdXRJdGVtXCIsXG4gICAga2V5OiB7XG4gICAgICBQSzogdXRpbC5keW5hbW9kYi50b0R5bmFtb0RCKGl0ZW0uZW1wbG95ZWVJZCksXG4gICAgICBTSzogdXRpbC5keW5hbW9kYi50b0R5bmFtb0RCKFwiSVRFTSNcIiArIGlkKSxcbiAgICB9LFxuICAgIGF0dHJpYnV0ZVZhbHVlczogdXRpbC5keW5hbW9kYi50b01hcFZhbHVlcyh7XG4gICAgICBwdWJsaXNoRGF0ZTogdXRpbC50aW1lLm5vd0lTTzg2MDEoKSxcbiAgICAgIC4uLml0ZW0sXG4gICAgICBVc2VySW52ZW50b3J5SW5kZXhQSzogaXRlbS5pbnZlbnRvcnlJZCxcbiAgICAgIFVzZXJJbnZlbnRvcnlJbmRleFNLOiBgSVRFTSR7aWR9YCxcbiAgICAgIEludmVudG9yeUl0ZW1JbmRleFNLOiBcIklURU1cIixcbiAgICAgIEludmVudG9yeUl0ZW1JbmRleFBLOiBgSVRFTSR7aWR9YCxcbiAgICB9KSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNlKGN0eDogQ29udGV4dDxJdGVtPikge1xuICByZXR1cm4gY3R4LnJlc3VsdDtcbn1cbiJdfQ==