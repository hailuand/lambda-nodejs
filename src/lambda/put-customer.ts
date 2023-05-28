import { Handler } from "aws-cdk-lib/aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerEntity } from "./customer-entity";
import { Customer } from "../../models/customer";

export const handler: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const customer = new Customer(123,
        35,
        "Jane Smith",
        true,
        "ACME",
        "Active",
        "2020-04-24");
    try {
        console.log(`Writing ${JSON.stringify(customer, undefined, 2)} to DynanoDB`);
        return {
            statusCode: 200,
            body: JSON.stringify(await CustomerEntity.put(customer), undefined, 2)
        }
    }
    catch(err) {
        console.error(`Something went wrong! ${JSON.stringify(err, undefined, 2)}`);
        return {
            statusCode: 500,
            body: `Something went wrong! ${JSON.stringify(err, undefined, 2)}`
        }
    }
}