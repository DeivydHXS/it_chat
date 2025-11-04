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
    friendship_id?: string
    is_active?: boolean
    admins?: UserChatsInterface[]
}

export interface UserChatsInterface {
    id: string,
    chat_id: string,
    user_id: string
    permission_type: string,
    created_at: string,
    updated_at: string,
}

export interface MessageInterface {
    id: string
    type: string
    content: string
    user_id: string
    user?: UserInterface
}

export interface ChatUpdateErrors {
    name?: string
    description?: string
    cover_image_url?: string
    icon_image_url?: string
    remove_icon?: string
    remove_cover?: string
}