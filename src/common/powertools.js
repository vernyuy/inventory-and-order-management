"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracer = exports.metrics = exports.logger = void 0;
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const tracer_1 = require("@aws-lambda-powertools/tracer");
const version_1 = require("@aws-lambda-powertools/commons/lib/version");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93ZXJ0b29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvd2VydG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMERBQXVEO0FBQ3ZELDREQUF5RDtBQUN6RCwwREFBdUQ7QUFDdkQsd0VBQXdFO0FBRXhFLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxLQUFLO0lBQ3ZDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLEtBQUs7Q0FDckQsQ0FBQztBQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDO0lBQ3hCLHVCQUF1QixFQUFFO1FBQ3ZCLEdBQUcsYUFBYTtRQUNoQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsK0JBQStCO1lBQ3JDLE9BQU8sRUFBRSxvQkFBVTtTQUNwQjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBUU0sd0JBQU07QUFOZixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUM7SUFDMUIsaUJBQWlCLEVBQUUsYUFBYTtDQUNqQyxDQUFDLENBQUM7QUFJYywwQkFBTztBQUZ4QixNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0FBRUYsd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9sb2dnZXJcIjtcbmltcG9ydCB7IE1ldHJpY3MgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9tZXRyaWNzXCI7XG5pbXBvcnQgeyBUcmFjZXIgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy90cmFjZXJcIjtcbmltcG9ydCB7IFBUX1ZFUlNJT04gfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9jb21tb25zL2xpYi92ZXJzaW9uXCI7XG5cbmNvbnN0IGRlZmF1bHRWYWx1ZXMgPSB7XG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiB8fCBcIk4vQVwiLFxuICBleGVjdXRpb25FbnY6IHByb2Nlc3MuZW52LkFXU19FWEVDVVRJT05fRU5WIHx8IFwiTi9BXCIsXG59O1xuXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAgcGVyc2lzdGVudExvZ0F0dHJpYnV0ZXM6IHtcbiAgICAuLi5kZWZhdWx0VmFsdWVzLFxuICAgIGxvZ2dlcjoge1xuICAgICAgbmFtZTogXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2xvZ2dlclwiLFxuICAgICAgdmVyc2lvbjogUFRfVkVSU0lPTixcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IG1ldHJpY3MgPSBuZXcgTWV0cmljcyh7XG4gIGRlZmF1bHREaW1lbnNpb25zOiBkZWZhdWx0VmFsdWVzLFxufSk7XG5cbmNvbnN0IHRyYWNlciA9IG5ldyBUcmFjZXIoKTtcblxuZXhwb3J0IHsgbG9nZ2VyLCBtZXRyaWNzLCB0cmFjZXIgfTtcbiJdfQ==