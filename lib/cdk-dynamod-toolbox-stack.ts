import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime, LayerVersion, Code } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from 'constructs';
import { CustomerTableDefn } from './customer-table-defn';
import { CustomerApi } from './customer-api';


export class CdkDynamodToolboxStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const tableDefn = new CustomerTableDefn(this, "CustomerTableDefn");

    const modelsLayer = new LayerVersion(this, "ModelsLayer", {
      compatibleRuntimes: [ Runtime.NODEJS_18_X ],
      layerVersionName: "ModelsLayer",
      code: Code.fromAsset("layers/models"),
      description: "Application models layer"
    });

    const putCustomerHandler = new NodejsFunction(this, "PutHandlerNjs", {
      runtime: Runtime.NODEJS_18_X,
      entry: "./lambda/put-customer.ts",
      handler: "handler",
      layers: [ modelsLayer ],
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: SourceMapMode.INLINE
      }
    });

    const getCustomerHandler = new NodejsFunction(this, "GetHandlerNjs", {
      runtime: Runtime.NODEJS_18_X,
      entry: "./lambda/get-customer.ts",
      handler: "handler",
      layers: [ modelsLayer ],
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: SourceMapMode.INLINE
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
