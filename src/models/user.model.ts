import { ReservationModel } from "./reservation.model"

export interface UserModel {
    email: string
    username: string
    phone: string
    address: string
    favoriteType: string
    password: string
    reservations: ReservationModel[]
}