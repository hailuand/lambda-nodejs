import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerEntity } from "./customer-entity";
import { Customer, CustomerSchema } from "../../models/customer";
import Ajv from "ajv";

const ajv = new Ajv({
    allErrors: true
});
const validateCustomer = ajv.compile(CustomerSchema);

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    console.log(`Raw: ${JSON.stringify(body, undefined, 2)}`);

    if(!validateCustomer(body)) {
        const errors: string[] = [];
        validateCustomer.errors?.forEach(e => errors.push(e.message as string));
        console.error(JSON.stringify(errors));
        const errResp = {
            message: `Invalid Customer schema: [${errors.join(", ")}]`
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