import { ReservationModel } from "../models/reservation.model"
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
                    favoriteType: 'Slagalica',
                    password: 'user123',
                    reservations: []
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

    static createReservation(reservation: ReservationModel) {
        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.reservations.push(reservation)
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }

    static changeReservationStatus(id: number, state: 'rezervisano' | 'pristiglo' | 'otkazano') {
        const active = this.getActiveUser()
        if (active) {
            const arr = this.retrieveUsers()
            for (let user of arr) {
                if (user.email == active.email) {
                    for (let reservation of user.reservations) {
                        if (reservation.id == id) {
                            reservation.status = state
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
            for (let reservation of user.reservations) {
                if (reservation.id === id) {
                    if (reservation.rating === rating) {
                        reservation.rating = null; 
                    } else {
                        reservation.rating = rating; 
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
                u.favoriteType = model.favoriteType
            }
        }

        localStorage.setItem('users', JSON.stringify(users))
    }
}