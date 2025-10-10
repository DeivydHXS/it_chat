import { TokenInterface, UserInfo, UserInterface, UserUpdateErrors } from "./user-interfaces"

export interface ResponseInterface {
    message: string
    data?: {
        user: UserInterface
    }
    errors?: ErrorsInterface
}

interface ErrorsInterface {
    email?: string
    password?: string
    password_confirmation?: string
    name?: string
    nickname?: string
    nickname_hash?: string
    birthday?: string
    bio?: string
    profile_image?: string
    code?: string
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

export interface IsBirthdayValidResponse {
    message: string
    errors?: {
        birthday: string
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