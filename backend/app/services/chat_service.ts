import Chat from "#models/chat";

export default class ChatService {
    public async store(type: string) {
        const chat = Chat.create({ type })
        return chat
    }
}