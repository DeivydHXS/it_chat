export default class ResponseService {
    public static async send(response: any, status: number, message: string, data: object) {
        const isStatusValid = status >= 200 && status <= 300 ? true : false
        
        if (!isStatusValid) {
            var errors: any = {}
            // @ts-ignore
            data.messages.forEach(bag => {
                errors[bag.field] = String(bag.message)
            });
            response.status(status).json({
                message,
                errors
            })
            return
        }
        
        response.status(status).json({
            message,
            data
        })
    }
}