export class Customer {
    constructor(public id: number,
        public age: number,
        public name: string,
        public emailVerified: boolean,
        public company: string,
        public status: string,
        public dateAdded: string) {}
}