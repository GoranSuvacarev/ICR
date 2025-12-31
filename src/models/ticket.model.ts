export interface TicketModel {
    id : number
    title: string
    runTime: number
    scheduledAt: string
    price: number 
    status: 'booked' | 'watched' 
    rating : number | null
}