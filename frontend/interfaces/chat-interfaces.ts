import { UserInterface } from "./user-interfaces";

export interface ChatInterface {
    id: string,
    name?: string,
    type: string,
    description?: string,
    coverImageUrl?: string,
    iconImageUrl?: string,
    createdAt?: string,
    updatedAt?: string,
    users: UserInterface[]
}