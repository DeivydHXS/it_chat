import Friendship, { FriendshipStatus } from "#models/friendship";
import User from "#models/user";
import { v4 } from "uuid";

export default class FriendService {
    public async search(user: User, search: string, status: string) {
        const ids = (await user.getFriends()).filter(f => f.status === status).map(f => {
            if (f.send_by === user.id) {
                return f.send_to as string
            }
            if (f.send_to === user.id) {
                return f.send_by as string
            }
        }).filter((id): id is string => !!id)

        const friends = await User.query().whereIn('id', ids)
            .if(search, (query) => {
                query.where((q) => {
                    q.whereILike('name', `%${search}%`)
                        .orWhereILike('nickname', `%${search}%`)
                        .orWhereILike('nickname_hash', `%${search}%`)
                })
            })

        return friends
    }

    public async accepted(user: User) {
        const ids = (await user.getFriends()).filter(f => f.status === 'a').map(f => {
            if (f.send_by === user.id) {
                return f.send_to as string
            }
            if (f.send_to === user.id) {
                return f.send_by as string
            }
        }).filter((id): id is string => !!id)

        const friends = await User.query().whereIn('id', ids)

        return friends
    }

    public async pending(user: User) {
        const ids = (await user.getFriends()).filter(f => f.status === 'p').map(f => {
            if (f.send_by === user.id) {
                return f.send_to as string
            }
            if (f.send_to === user.id) {
                return f.send_by as string
            }
        }).filter((id): id is string => !!id)

        const solicitations = await User.query().whereIn('id', ids)

        return solicitations
    }

    public async send_solicitation(currentUser: User, friendId: string) {
        await Friendship.create({
            id: v4(),
            send_by: currentUser.id as string,
            send_to: friendId,
            status: FriendshipStatus.Pending
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