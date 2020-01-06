export abstract class User {
    public static create({
        firstName,
        lastName,
        age,
    }: Pick<User, 'firstName' | 'lastName' | 'age'>): User {
        return new (class extends User {
            id: number = 0
            firstName: string = firstName
            lastName: string = lastName
            age: number = age
        })()
    }

    abstract id: number
    abstract firstName: string
    abstract lastName: string
    abstract age: number

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }
}
