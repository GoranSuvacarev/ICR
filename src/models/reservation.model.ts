export interface ReservationModel {
    id : number
    name: string
    description: string
    type: string
    ageGroup: string
    targetGroup: string
    productionDate: string
    price: number 
    status: 'rezervisano' | 'pristiglo' | 'otkazano' 
    rating : number | null
}