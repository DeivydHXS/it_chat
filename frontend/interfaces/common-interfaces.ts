import { UserInfo } from "./user-interfaces"

export interface ResponseInterface {
    message: string
    data?: string
    errors?: UserInfo
}