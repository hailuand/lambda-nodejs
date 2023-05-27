import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";

export class CustomerTableDefn extends Construct {
    readonly table: dynamodb.Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        
        this.table = new dynamodb.Table(this, "MySingleTable", {
            tableName: "my-table",
            partitionKey: {
                name: "pk",
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: "sk",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}