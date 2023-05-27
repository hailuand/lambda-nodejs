import { IFunction } from "aws-cdk-lib/aws-lambda";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export interface CustomerApiProps {
    putLambda: IFunction;
    getLambda: IFunction;
}

export class CustomerApi extends Construct {
    constructor(scope: Construct, id: string, props?: CustomerApiProps) {
        super(scope, id);

        const api = new RestApi(this, "CustomerApiGateway", {
            restApiName: "Customer APIs",
            description: "APIs for Customer module"
        });
        const customerApi = api.root.addResource("customer");

        const putCustomerApi = new LambdaIntegration(props!.putLambda, {
            requestTemplates: {
                "application/json": "{ statusCode: 200 }",
            },
        })
        customerApi.addResource("put").addMethod("PUT", putCustomerApi);

        const getCustomerApi = new LambdaIntegration(props!.getLambda, {
            requestTemplates: {
                "application/json": "{ statusCode: 200 }",
            },
        });
        customerApi.addResource("getCustomer").addMethod("GET", getCustomerApi);
    }
}