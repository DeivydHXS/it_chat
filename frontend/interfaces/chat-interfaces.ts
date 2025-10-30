import { UserInterface } from "./user-interfaces";

export interface ChatInterface {
    id: string
    name?: string
    type: string
    description?: string
    cover_image_url?: string
    icon_image_url?: string
    createdAt?: string
    updatedAt?: string
    users: UserInterface[]
    messages: MessageInterface[]
    last_message?: MessageInterface
    blocker_id?: string
    is_active?: boolean
}

export interface MessageInterface {
    id: string
    type: string
    content: string
    user_id: string
    user?: UserInterface
}