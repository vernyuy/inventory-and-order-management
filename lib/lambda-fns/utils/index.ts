import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { PT_VERSION } from "@aws-lambda-powertools/commons/lib/version";
import ksuid from "ksuid";

export const uuid = (): string => {
  return ksuid.randomSync().string;
};

const defaultValues = {
  region: process.env.AWS_REGION || "N/A",
  executionEnv: process.env.AWS_EXECUTION_ENV || "N/A",
};

const logger = new Logger({
  persistentLogAttributes: {
    ...defaultValues,
    logger: {
      name: "@aws-lambda-powertools/logger",
      version: PT_VERSION,
    },
  },
});

const metrics = new Metrics({
  defaultDimensions: defaultValues,
});

const tracer = new Tracer();

export { logger, metrics, tracer };