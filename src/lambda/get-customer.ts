import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CustomerEntity } from "./customer-entity";
import { Customer, CustomerSchema } from "../../models/customer";
import Ajv from "ajv";
import winston = require("winston");
import { pino } from "pino";

const ajv = new Ajv({
    allErrors: true
});
const validateCustomer = ajv.compile(CustomerSchema);
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});
// const logger = pino({
//     timestamp: pino.stdTimeFunctions.isoTime,
//     base: undefined, // removes pid + hostname
//     formatters: {
//         level(level) { // uses text instead of numerical level representation
//             return {level};
//         }
//     }
// });
// Log even uncaught exceptions
process.on('uncaughtException', (err) => {
    // logger.fatal(err);
    logger.crit(err);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (err) => {
    // logger.fatal(err);
    logger.crit(err);
    process.exit(1);
  });

export const handler = async(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    logger.defaultMeta = {requestId: context.awsRequestId};
    
    let body;
    
    try {
        body = JSON.parse(event.body as string);
    }
    catch(err) {
        const errResp = {
            message: `Invalid Customer schema: ${err}`
        }
        return {
            statusCode: 400,
            body: JSON.stringify(errResp)
        }
    }
    logger.info("Testing testing 123!");
    logger.info(`Raw: ${JSON.stringify(body, undefined, 2)}`);

    if(!validateCustomer(body)) {
        // const errors: string[] = [];
        // validateCustomer.errors?.forEach(e => errors.push(e.));
        logger.error(JSON.stringify(validateCustomer.errors));
        const errResp = {
            message: validateCustomer.errors
        };
        return {
            statusCode: 400,
            body: JSON.stringify(errResp)
        };
    }
    const customer: Customer = Object.assign(new Customer(), body);
    logger.info(`Parsed: ${JSON.stringify(customer, undefined, 2)}`);

    return {
        statusCode: 200,
        body: JSON.stringify(customer, undefined, 2)
    }
}