import { JSONSchemaType } from "ajv";

export class Customer {
    public id: number;
        public age: number;
        public name: string;
        public emailVerified: boolean;
        public company: string;
        public status: string;
        public dateAdded: string;
}

export const CustomerSchema: JSONSchemaType<Customer> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        age: { type: "integer" },
        name: { type: "string" },
        emailVerified: { type: "boolean" },
        company: { type: "string" },
        status: { type: "string" },
        dateAdded: { type: "string" },
    },
    required: [ "id", "age", "name", "emailVerified", "company", "status", "dateAdded" ],
    additionalProperties: false
};
