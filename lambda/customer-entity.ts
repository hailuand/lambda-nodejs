import { Entity, Table } from "dynamodb-toolbox";
import { DocumentClient } from "./client";

const CustomerTable = new Table({
    name: "my-table",
    partitionKey: "pk",
    sortKey: "sk",
    DocumentClient
});

export const CustomerEntity = new Entity({
    name: "Customer",

    attributes: {
        id: { partitionKey: true },
        sk: { hidden: true, sortKey: true },
        age: { type: "number", required: true },
        name: { type: "string", map: "data" },
        emailVerified: { type: "boolean", required: true },
        co: { alias: "company" },
        status: ["sk", 0],
        dateAdded: ["sk", 1]
    },
    
    table: CustomerTable
} as const);