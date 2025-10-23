import Friendship, { FriendshipStatus } from "#models/friendship";
import User from "#models/user";
import db from "@adonisjs/lucid/services/db";
import { v4 } from "uuid";

export default class FriendService {
    public async search(userId: string, search?: string, status?: string) {
        const users = await User.query()
            .select(
                'users.*',
                'friendships.id as friendship_id',
                'friendships.status as friendship_status',
                'friendships.blocker_id as friendship_blocker_id'
            )
            .innerJoin('friendships', (join) => {
                join.on((q) => {
                    q.on('users.id', '=', 'friendships.send_to')
                        .orOn('users.id', '=', 'friendships.send_by')
                })
            })
            .where((q) => {
                q.where('friendships.send_by', userId).orWhere('friendships.send_to', userId)
            })
            .andWhereNot('users.id', userId)
            .andWhere((q) => {
                q.whereNull('friendships.blocker_id')
                    .orWhere('friendships.blocker_id', userId)
            })
            .if(status, (q) => {
                q.andWhere('friendships.status', status as string)
            })
            .if(search && search.trim() !== '', (q) => {
                q.where((sub) => {
                    sub
                        .whereILike('users.name', `%${search}%`)
                        .orWhereILike('users.nickname', `%${search}%`)
                        .orWhereILike('users.nickname_hash', `%${search}%`)
                })
            })
            .orderBy('friendships.created_at', 'desc')

        return users.map((u) => ({
            ...u.serialize(),
            friendship_id: u.$extras.friendship_id,
            friendship_status: u.$extras.friendship_status,
            friendship_blocker_id: u.$extras.friendship_blocker_id,
        }))
    }
 
    public async accepted(user: User) {
        const users = await User.query()
            .select(
                'users.*',
                'friendships.id as friendship_id',
                'friendships.status as friendship_status',
                'friendships.blocker_id as friendship_blocker_id',
                db.raw(`
                        (
                            select uc1.chat_id
                            from user_chats uc1
                            join user_chats uc2 on uc1.chat_id = uc2.chat_id
                            where uc1.user_id = ? and uc2.user_id = users.id
                            limit 1
                        ) as chat_id
                        `, [user.id])
            )
            .innerJoin('friendships', (join) => {
                join.on((q) => {
                    q.on('users.id', '=', 'friendships.send_to')
                        .orOn('users.id', '=', 'friendships.send_by')
                })
            })
            .where((q) => {
                q.where('friendships.send_by', user.id as string)
                    .orWhere('friendships.send_to', user.id as string)
            })
            .andWhereNot('users.id', user.id as string)
            .andWhere((q) => {
                q.whereNull('friendships.blocker_id')
                    .orWhere('friendships.blocker_id', user.id as string)
            })
            .andWhere((q) => {
                q.where('friendships.status', 'a')
                    .orWhere('friendships.status', 'b')
            })
            .orderBy('friendships.created_at', 'desc')

        return users.map((u) => ({
            ...u.serialize(),
            friendship_id: u.$extras.friendship_id,
            friendship_status: u.$extras.friendship_status,
            friendship_blocker_id: u.$extras.friendship_blocker_id,
            chat_id: u.$extras.chat_id,
        }))
    }

    public async pending(user: User) {
        const users = await User.query()
            .select('users.*', 'friendships.id as friendship_id')
            .innerJoin('friendships', (join) => {
                join
                    .on((q) => {
                        q.on('users.id', '=', 'friendships.send_by')
                            .orOn('users.id', '=', 'friendships.send_to')
                    })
            })
            .where('friendships.send_to', user.id as string)
            .andWhere('friendships.status', 'p')
            .andWhereNot('users.id', user.id as string)
            .orderBy('friendships.created_at', 'desc')

        return users.map((u) => ({
            ...u.serialize(),
            friendship_id: u.$extras.friendship_id,
        }))
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

    public async block(friendship: Friendship, blocker_id: string) {
        friendship.status = FriendshipStatus.Blocked
        friendship.blocker_id = blocker_id
        await friendship.save()
    }

    public async unblock(friendship: Friendship) {
        friendship.status = FriendshipStatus.Accepted
        friendship.blocker_id = null
        await friendship.save()
    }

    public async unfriend(friendship: Friendship) {
        await friendship.delete()
    }
}