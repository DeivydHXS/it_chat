import { TokenInterface, UserInfo, UserInterface, UserUpdateErrors } from "./user-interfaces"

export interface ResponseInterface {
    message: string
    data?: {
        user: UserInterface
    }
    errors?: UserInfo | UserUpdateErrors
}

export interface UserUpdateResponse {
    message: string
    data?: {
        user: UserInterface
    }
    errors?: UserUpdateErrors
}

export interface IsEmailValidResponse {
    message: string
    errors?: {
        email: string
    }
}

export interface LoginInterface {
    message: string
    data?: {
        user: UserInterface
        token: TokenInterface
    }
    errors?: {
        email: string
        password: string
    }
}

export interface ForgotPasswordResponseInterface {
    message: string
    errors?: {
        code: string
    }
}