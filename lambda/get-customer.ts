import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerEntity } from "./customer-entity";
import { Customer } from "/opt/models";

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const lookup = {
        id: 123, status: "Active", dateAdded: "2020-04-24"
    };
    console.log(`Looking up Customer: ${JSON.stringify(lookup, undefined, 2)}`);
    const item = (await CustomerEntity.get(lookup)).Item;
    const customer = new Customer(item!.id, item!.age as number, item!.name as string, item!.emailVerified, 
        item?.co, item?.status, item?.dateAdded);
    return {
        statusCode: 200,
        body: JSON.stringify(customer)
    }
}