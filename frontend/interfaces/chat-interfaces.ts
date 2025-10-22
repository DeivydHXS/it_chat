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
    messages: MessageInterface[]
    last_message?: MessageInterface
}

export interface MessageInterface {
    id: string
    type: string
    content: string
    user_id: string
}