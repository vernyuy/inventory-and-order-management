"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleAppSyncResolver = void 0;
const aws_appsync_1 = require("aws-cdk-lib/aws-appsync");
const esbuild = __importStar(require("esbuild"));
const bundleAppSyncResolver = (entryPoint) => {
    const result = esbuild.buildSync({
        entryPoints: [entryPoint],
        external: ["@aws-appsync/utils"],
        bundle: true,
        write: false,
        platform: "node",
        target: "esnext",
        format: "esm",
        sourcemap: "inline",
        sourcesContent: false,
    });
    return aws_appsync_1.Code.fromInline(result.outputFiles[0].text);
};
exports.bundleAppSyncResolver = bundleAppSyncResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5REFBK0M7QUFDL0MsaURBQW1DO0FBRTVCLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxVQUFrQixFQUFRLEVBQUU7SUFDaEUsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUMvQixXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7UUFDekIsUUFBUSxFQUFFLENBQUMsb0JBQW9CLENBQUM7UUFDaEMsTUFBTSxFQUFFLElBQUk7UUFDWixLQUFLLEVBQUUsS0FBSztRQUNaLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsY0FBYyxFQUFFLEtBQUs7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxrQkFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELENBQUMsQ0FBQztBQWRXLFFBQUEscUJBQXFCLHlCQWNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvZGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCAqIGFzIGVzYnVpbGQgZnJvbSBcImVzYnVpbGRcIjtcblxuZXhwb3J0IGNvbnN0IGJ1bmRsZUFwcFN5bmNSZXNvbHZlciA9IChlbnRyeVBvaW50OiBzdHJpbmcpOiBDb2RlID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gZXNidWlsZC5idWlsZFN5bmMoe1xuICAgIGVudHJ5UG9pbnRzOiBbZW50cnlQb2ludF0sXG4gICAgZXh0ZXJuYWw6IFtcIkBhd3MtYXBwc3luYy91dGlsc1wiXSxcbiAgICBidW5kbGU6IHRydWUsXG4gICAgd3JpdGU6IGZhbHNlLFxuICAgIHBsYXRmb3JtOiBcIm5vZGVcIixcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXG4gICAgZm9ybWF0OiBcImVzbVwiLFxuICAgIHNvdXJjZW1hcDogXCJpbmxpbmVcIixcbiAgICBzb3VyY2VzQ29udGVudDogZmFsc2UsXG4gIH0pO1xuXG4gIHJldHVybiBDb2RlLmZyb21JbmxpbmUocmVzdWx0Lm91dHB1dEZpbGVzWzBdLnRleHQpO1xufTtcbiJdfQ==