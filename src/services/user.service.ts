import { TicketModel } from "../models/ticket.model"
import { UserModel } from "../models/user.model"

export class UserService {

    static retrieveUsers(): UserModel[] {
        if (!localStorage.getItem('users')) {
            const arr: UserModel[] = [
                {
                    email: 'user@example.com',
                    username: 'Example',
                    phone: '+3816123456789',
                    address: 'Mokroluska 14, Vozdovac',
                    favoriteGenre: 'Fantazija',
                    password: 'user123',
                    tickets: []
                }
            ]

            localStorage.setItem('users', JSON.stringify(arr))
        }

        return JSON.parse(localStorage.getItem('users')!)
    }

    static createUser(model: UserModel) {
        const users = this.retrieveUsers()

        for (let u of users) {
            if (u.email === model.email)
                return false
        }

        users.push(model)
        localStorage.setItem('users', JSON.stringify(users))
        return true
    }

    static login(email: string, password: string): boolean {
        for (let user of this.retrieveUsers()) {
            if (user.email === email && user.password === password) {
                localStorage.setItem('active', user.email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        if (!localStorage.getItem('active'))
            return null

        for (let user of this.retrieveUsers()) {
            if (user.email == localStorage.getItem('active')) {
                return user
            }
        }

        return null
    }

    static createTicket(ticket: TicketModel) {
        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.tickets.push(ticket)
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }

    static changeTicketStatus(id: number, title : string) {
        const active = this.getActiveUser()
        if (active) {
            const arr = this.retrieveUsers()
            for (let user of arr) {
                if (user.email == active.email) {
                    for (let ticket of user.tickets) {
                        if (ticket.id == id) {
                            ticket.status = 'watched'
                        }
                    }
                    localStorage.setItem('users', JSON.stringify(arr))
                    return true
                }
            }
        }
        return false
    }


static changeRating(rating: number, id: number) {
    const active = this.getActiveUser();
    if (!active) return false;

    const users = this.retrieveUsers();
    for (let user of users) {
        if (user.email === active.email) {
            for (let ticket of user.tickets) {
                if (ticket.id === id) {
                    if (ticket.rating === rating) {
                        ticket.rating = null; 
                    } else {
                        ticket.rating = rating; 
                    }
                }
            }
            localStorage.setItem('users', JSON.stringify(users)); 
            return true;
        }
    }
    return false;
}


    static changePassword(newPassword: string): boolean {

        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.password = newPassword
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }

    static updateUser(model: UserModel) {
        const users = this.retrieveUsers()
        for (let u of users) {
            if (u.email === model.email) {
                u.username = model.username
                u.email = model.email
                u.address = model.address
                u.phone = model.phone
                u.favoriteGenre = model.favoriteGenre
            }
        }

        localStorage.setItem('users', JSON.stringify(users))
    }
}