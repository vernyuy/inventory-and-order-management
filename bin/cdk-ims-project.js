#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const cdk_ims_project_stack_1 = require("../lib/cdk-ims-project-stack");
// import lambdaStack.ts
// import { LambdaStack } from "../lib/compute/lambdaStack";
const app = new cdk.App();
// const lambdas = new LambdaStack(app, "LambdaStack", {
//   env: { account: "132260253285", region: "eu-west-1" },
// });
// new CdkImsProjectStack(app, "CdkImsProjectStack", {
//   targetLambda: lambdas.lambdaName,
//   env: { account: "132260253285", region: "eu-west-1" },
// });
new cdk_ims_project_stack_1.CdkImsProjectStack(app, "CdkImsProjectStack", {
    env: { account: "132260253285", region: "eu-west-1" },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWltcy1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLWltcy1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsd0VBQWtFO0FBQ2xFLHdCQUF3QjtBQUN4Qiw0REFBNEQ7QUFFNUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsd0RBQXdEO0FBQ3hELDJEQUEyRDtBQUMzRCxNQUFNO0FBQ04sc0RBQXNEO0FBQ3RELHNDQUFzQztBQUN0QywyREFBMkQ7QUFDM0QsTUFBTTtBQUVOLElBQUksMENBQWtCLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFO0lBQ2hELEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtDQUN0RCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgXCJzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXJcIjtcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENka0ltc1Byb2plY3RTdGFjayB9IGZyb20gXCIuLi9saWIvY2RrLWltcy1wcm9qZWN0LXN0YWNrXCI7XG4vLyBpbXBvcnQgbGFtYmRhU3RhY2sudHNcbi8vIGltcG9ydCB7IExhbWJkYVN0YWNrIH0gZnJvbSBcIi4uL2xpYi9jb21wdXRlL2xhbWJkYVN0YWNrXCI7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4vLyBjb25zdCBsYW1iZGFzID0gbmV3IExhbWJkYVN0YWNrKGFwcCwgXCJMYW1iZGFTdGFja1wiLCB7XG4vLyAgIGVudjogeyBhY2NvdW50OiBcIjEzMjI2MDI1MzI4NVwiLCByZWdpb246IFwiZXUtd2VzdC0xXCIgfSxcbi8vIH0pO1xuLy8gbmV3IENka0ltc1Byb2plY3RTdGFjayhhcHAsIFwiQ2RrSW1zUHJvamVjdFN0YWNrXCIsIHtcbi8vICAgdGFyZ2V0TGFtYmRhOiBsYW1iZGFzLmxhbWJkYU5hbWUsXG4vLyAgIGVudjogeyBhY2NvdW50OiBcIjEzMjI2MDI1MzI4NVwiLCByZWdpb246IFwiZXUtd2VzdC0xXCIgfSxcbi8vIH0pO1xuXG5uZXcgQ2RrSW1zUHJvamVjdFN0YWNrKGFwcCwgXCJDZGtJbXNQcm9qZWN0U3RhY2tcIiwge1xuICBlbnY6IHsgYWNjb3VudDogXCIxMzIyNjAyNTMyODVcIiwgcmVnaW9uOiBcImV1LXdlc3QtMVwiIH0sXG59KTtcbiJdfQ==