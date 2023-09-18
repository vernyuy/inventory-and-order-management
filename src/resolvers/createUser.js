"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const utils_1 = require("@aws-appsync/utils");
const helpers_1 = require("../lib/helpers");
function request(ctx) {
    // add timestamps
    const user = (0, helpers_1.createItem)(ctx.args.input);
    const id = utils_1.util.autoId();
    return {
        operation: "PutItem",
        key: {
            id: utils_1.util.dynamodb.toDynamoDB(`USER#${id}`),
            sk: utils_1.util.dynamodb.toDynamoDB(`USER#${id}`),
        },
        attributeValues: utils_1.util.dynamodb.toMapValues({
            publishDate: utils_1.util.time.nowISO8601(),
            ...user,
            GSI1PK: "USER",
        }),
    };
}
exports.request = request;
function response(ctx) {
    return ctx.result;
}
exports.response = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQTJFO0FBQzNFLDRDQUE0QztBQUc1QyxTQUFnQixPQUFPLENBQ3JCLEdBQW9DO0lBRXBDLGlCQUFpQjtJQUNqQixNQUFNLElBQUksR0FBRyxJQUFBLG9CQUFVLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxNQUFNLEVBQUUsR0FBRyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFekIsT0FBTztRQUNMLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLEdBQUcsRUFBRTtZQUNILEVBQUUsRUFBRSxZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsRUFBRSxZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsZUFBZSxFQUFFLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3pDLFdBQVcsRUFBRSxZQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQyxHQUFHLElBQUk7WUFDUCxNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7S0FDSCxDQUFDO0FBQ0osQ0FBQztBQW5CRCwwQkFtQkM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBa0I7SUFDekMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3BCLENBQUM7QUFGRCw0QkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIER5bmFtb0RCUHV0SXRlbVJlcXVlc3QsIHV0aWwgfSBmcm9tIFwiQGF3cy1hcHBzeW5jL3V0aWxzXCI7XG5pbXBvcnQgeyBjcmVhdGVJdGVtIH0gZnJvbSBcIi4uL2xpYi9oZWxwZXJzXCI7XG5pbXBvcnQgeyBNdXRhdGlvbkNyZWF0ZVVzZXJBcmdzLCBVc2VyIH0gZnJvbSBcIi4uL3R5cGVzL2FwcHN5bmNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoXG4gIGN0eDogQ29udGV4dDxNdXRhdGlvbkNyZWF0ZVVzZXJBcmdzPlxuKTogRHluYW1vREJQdXRJdGVtUmVxdWVzdCB7XG4gIC8vIGFkZCB0aW1lc3RhbXBzXG4gIGNvbnN0IHVzZXIgPSBjcmVhdGVJdGVtKGN0eC5hcmdzLmlucHV0KTtcbiAgY29uc3QgaWQgPSB1dGlsLmF1dG9JZCgpO1xuXG4gIHJldHVybiB7XG4gICAgb3BlcmF0aW9uOiBcIlB1dEl0ZW1cIixcbiAgICBrZXk6IHtcbiAgICAgIGlkOiB1dGlsLmR5bmFtb2RiLnRvRHluYW1vREIoYFVTRVIjJHtpZH1gKSxcbiAgICAgIHNrOiB1dGlsLmR5bmFtb2RiLnRvRHluYW1vREIoYFVTRVIjJHtpZH1gKSxcbiAgICB9LFxuICAgIGF0dHJpYnV0ZVZhbHVlczogdXRpbC5keW5hbW9kYi50b01hcFZhbHVlcyh7XG4gICAgICBwdWJsaXNoRGF0ZTogdXRpbC50aW1lLm5vd0lTTzg2MDEoKSxcbiAgICAgIC4uLnVzZXIsXG4gICAgICBHU0kxUEs6IFwiVVNFUlwiLFxuICAgIH0pLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzcG9uc2UoY3R4OiBDb250ZXh0PFVzZXI+KSB7XG4gIHJldHVybiBjdHgucmVzdWx0O1xufVxuIl19