import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerEntity } from "./customer-entity";
import { Customer, CustomerSchema } from "../../models/customer";
import Ajv from "ajv";

const ajv = new Ajv({
    allErrors: true
});
const validateCustomer = ajv.compile(CustomerSchema);

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    
    console.log(`Raw: ${JSON.stringify(body, undefined, 2)}`);

    if(!validateCustomer(body)) {
        // const errors: string[] = [];
        // validateCustomer.errors?.forEach(e => errors.push(e.));
        console.error(JSON.stringify(validateCustomer.errors));
        const errResp = {
            message: validateCustomer.errors
        };
        return {
            statusCode: 400,
            body: JSON.stringify(errResp)
        };
    }
    const customer: Customer = Object.assign(new Customer(), body);
    console.log(`Parsed: ${JSON.stringify(customer, undefined, 2)}`);

    return {
        statusCode: 200,
        body: JSON.stringify(customer, undefined, 2)
    }
}