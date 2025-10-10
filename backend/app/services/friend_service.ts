import Friendship, { FriendshipStatus } from "#models/friendship";
import User from "#models/user";
import { v4 } from "uuid";

export default class FriendService {
    public async search(user: User, search: string) {
        const friends = await user.related('friendships').query()
            .if(search, (query) => {
                query.where((q) => {
                    q.whereILike('name', `%${search}%`)
                        .orWhereILike('nickname', `%${search}%`)
                        .orWhereILike('nickname_hash', `%${search}%`)
                })
            })
            .orderBy('created_at', 'desc')

        return friends
    }

    public async send_solicitation(currentUser: User, friendId: string) {
        await currentUser.related('friendships').attach({
            [friendId]: { id: v4(), status: FriendshipStatus.Pending },
        })
    }

    public async accept(friendship: Friendship) {
        friendship.status = FriendshipStatus.Accepted
        await friendship.save()
    }

    public async refuse(friendship: Friendship) {
        friendship.status = FriendshipStatus.Refused
        await friendship.save()
    }

    public async block(friendship: Friendship) {
        friendship.status = FriendshipStatus.Blocked
        await friendship.save()
    }

    public async unfriend(friendship: Friendship) {
        await friendship.delete()
    }
}