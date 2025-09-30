import { TokenInterface, UserInfo, UserInterface } from "./user-interfaces"

export interface ResponseInterface {
    message: string
    data?: string
    errors?: UserInfo
}

export interface LoginInterface {
    message: string
    data: {
        user: UserInterface
        token: TokenInterface
    }
}