import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const marshallOptions = {
    convertEmptyValues: false
};
const translateConfig = { marshallOptions };

export const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig);