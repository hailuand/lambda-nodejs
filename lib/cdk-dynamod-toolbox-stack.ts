import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from 'constructs';
import { CustomerTableDefn } from './customer-table-defn';
import { CustomerApi } from './customer-api';


export class CdkDynamodToolboxStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const tableDefn = new CustomerTableDefn(this, "CustomerTableDefn");

    const putCustomerHandler = new NodejsFunction(this, "PutHandlerNjs", {
      runtime: Runtime.NODEJS_18_X,
      entry: "./lambda/put-customer.ts",
      handler: "handler",
      bundling: {
        minify: true,
        sourceMap: true
      }
    });

    const getCustomerHandler = new NodejsFunction(this, "GetHandlerNjs", {
      runtime: Runtime.NODEJS_18_X,
      entry: "./lambda/get-customer.ts",
      handler: "handler",
      bundling: {
        minify: true,
        sourceMap: true
      }
    });

    tableDefn.table.grantReadWriteData(getCustomerHandler);
    tableDefn.table.grantReadWriteData(putCustomerHandler);

    new CustomerApi(this, "CustomerApi", {
      getLambda: getCustomerHandler,
      putLambda: putCustomerHandler
    });
  }
}
