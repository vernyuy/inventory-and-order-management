"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracer = exports.metrics = exports.logger = exports.uuid = void 0;
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const tracer_1 = require("@aws-lambda-powertools/tracer");
const version_1 = require("@aws-lambda-powertools/commons/lib/version");
const ksuid_1 = __importDefault(require("ksuid"));
const uuid = () => {
    return ksuid_1.default.randomSync().string;
};
exports.uuid = uuid;
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
exports.logger = logger;
const metrics = new metrics_1.Metrics({
    defaultDimensions: defaultValues,
});
exports.metrics = metrics;
const tracer = new tracer_1.Tracer();
exports.tracer = tracer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFBdUQ7QUFDdkQsNERBQXlEO0FBQ3pELDBEQUF1RDtBQUN2RCx3RUFBd0U7QUFDeEUsa0RBQTBCO0FBRW5CLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRTtJQUMvQixPQUFPLGVBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDbkMsQ0FBQyxDQUFDO0FBRlcsUUFBQSxJQUFJLFFBRWY7QUFFRixNQUFNLGFBQWEsR0FBRztJQUNwQixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksS0FBSztJQUN2QyxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxLQUFLO0NBQ3JELENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQztJQUN4Qix1QkFBdUIsRUFBRTtRQUN2QixHQUFHLGFBQWE7UUFDaEIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLCtCQUErQjtZQUNyQyxPQUFPLEVBQUUsb0JBQVU7U0FDcEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQVFNLHdCQUFNO0FBTmYsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDO0lBQzFCLGlCQUFpQixFQUFFLGFBQWE7Q0FDakMsQ0FBQyxDQUFDO0FBSWMsMEJBQU87QUFGeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztBQUVGLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvbG9nZ2VyXCI7XG5pbXBvcnQgeyBNZXRyaWNzIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvbWV0cmljc1wiO1xuaW1wb3J0IHsgVHJhY2VyIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvdHJhY2VyXCI7XG5pbXBvcnQgeyBQVF9WRVJTSU9OIH0gZnJvbSBcIkBhd3MtbGFtYmRhLXBvd2VydG9vbHMvY29tbW9ucy9saWIvdmVyc2lvblwiO1xuaW1wb3J0IGtzdWlkIGZyb20gXCJrc3VpZFwiO1xuXG5leHBvcnQgY29uc3QgdXVpZCA9ICgpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4ga3N1aWQucmFuZG9tU3luYygpLnN0cmluZztcbn07XG5cbmNvbnN0IGRlZmF1bHRWYWx1ZXMgPSB7XG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiB8fCBcIk4vQVwiLFxuICBleGVjdXRpb25FbnY6IHByb2Nlc3MuZW52LkFXU19FWEVDVVRJT05fRU5WIHx8IFwiTi9BXCIsXG59O1xuXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAgcGVyc2lzdGVudExvZ0F0dHJpYnV0ZXM6IHtcbiAgICAuLi5kZWZhdWx0VmFsdWVzLFxuICAgIGxvZ2dlcjoge1xuICAgICAgbmFtZTogXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2xvZ2dlclwiLFxuICAgICAgdmVyc2lvbjogUFRfVkVSU0lPTixcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IG1ldHJpY3MgPSBuZXcgTWV0cmljcyh7XG4gIGRlZmF1bHREaW1lbnNpb25zOiBkZWZhdWx0VmFsdWVzLFxufSk7XG5cbmNvbnN0IHRyYWNlciA9IG5ldyBUcmFjZXIoKTtcblxuZXhwb3J0IHsgbG9nZ2VyLCBtZXRyaWNzLCB0cmFjZXIgfTtcbiJdfQ==