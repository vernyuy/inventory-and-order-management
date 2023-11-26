"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const dynamodb_1 = require("@aws-appsync/utils/dynamodb");
const helpers_1 = require("../lib/helpers");
function request(ctx) {
    // add timestamps
    const items = ctx.args.input;
    const item = (0, helpers_1.addItemToCart)(() => ctx.args.input);
    const key = {
        PK: `USER#${items?.userId}`,
        SK: `ITEM#${items?.item}`,
    };
    return (0, dynamodb_1.put)({
        key,
        item,
    });
}
exports.request = request;
function response(ctx) {
    return ctx.result;
}
exports.response = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkSXRlbVRvQ2FydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFkZEl0ZW1Ub0NhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMERBQWtEO0FBQ2xELDRDQUErQztBQUcvQyxTQUFnQixPQUFPLENBQUMsR0FBdUM7SUFDN0QsaUJBQWlCO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzdCLE1BQU0sSUFBSSxHQUFHLElBQUEsdUJBQWEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pELE1BQU0sR0FBRyxHQUFHO1FBQ1YsRUFBRSxFQUFFLFFBQVEsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMzQixFQUFFLEVBQUUsUUFBUSxLQUFLLEVBQUUsSUFBSSxFQUFFO0tBQzFCLENBQUM7SUFFRixPQUFPLElBQUEsY0FBRyxFQUFDO1FBQ1QsR0FBRztRQUNILElBQUk7S0FDTCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsMEJBYUM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBMkI7SUFDbEQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3BCLENBQUM7QUFGRCw0QkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiQGF3cy1hcHBzeW5jL3V0aWxzXCI7XG5pbXBvcnQgeyBwdXQgfSBmcm9tIFwiQGF3cy1hcHBzeW5jL3V0aWxzL2R5bmFtb2RiXCI7XG5pbXBvcnQgeyBhZGRJdGVtVG9DYXJ0IH0gZnJvbSBcIi4uL2xpYi9oZWxwZXJzXCI7XG5pbXBvcnQgeyBNdXRhdGlvbkFkZEl0ZW1Ub0NhcnRBcmdzLCBBZGRJdGVtVG9DYXJ0IH0gZnJvbSBcIi4uL3R5cGVzL2FwcHN5bmNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoY3R4OiBDb250ZXh0PE11dGF0aW9uQWRkSXRlbVRvQ2FydEFyZ3M+KSB7XG4gIC8vIGFkZCB0aW1lc3RhbXBzXG4gIGNvbnN0IGl0ZW1zID0gY3R4LmFyZ3MuaW5wdXQ7XG4gIGNvbnN0IGl0ZW0gPSBhZGRJdGVtVG9DYXJ0KCgpID0+IGN0eC5hcmdzLmlucHV0KTtcbiAgY29uc3Qga2V5ID0ge1xuICAgIFBLOiBgVVNFUiMke2l0ZW1zPy51c2VySWR9YCxcbiAgICBTSzogYElURU0jJHtpdGVtcz8uaXRlbX1gLFxuICB9O1xuXG4gIHJldHVybiBwdXQoe1xuICAgIGtleSxcbiAgICBpdGVtLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNlKGN0eDogQ29udGV4dDxBZGRJdGVtVG9DYXJ0Pikge1xuICByZXR1cm4gY3R4LnJlc3VsdDtcbn1cbiJdfQ==