// User roles
export type Roles = 'Admin' | 'User'


// User Schema Interface
export interface User {
    email: string
    first_name: string
    last_name: string
    password: string
    account_created: Date
    role: Roles
    account_confirmed: boolean
}

export interface CurrentUserObject extends Omit<User, 'password'> {
    _id: Types.ObjectId    
}

declare module 'express' {
    export interface Request {
        currentUser?: CurrentUserObject
    }
}


export interface Product {
    name: string
    category: string
    metadata: metadata[]
    
}

type metadata = string