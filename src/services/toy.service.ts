// API sa igračkama
// Poštovane koleginice i kolege,
// U prilogu se nalaze dostupne putanje za upotrebu API-ja za potrebe ispita
// Niste u obavezi da koristite ovaj API za realizaciju vašeg projekta.
 
// Početna putanja: https://toy.pequla.com/api
 
// Dostupne putanje:

// - GET /toy - Lista svih igrčaka

// - GET /toy/:id - Igrčaka za ID

// - GET /toy/permalink/:permalink`- Igrčaka za permalink

// - POST /toy/list - Body treba da bude Array ID-jeva - Vraca listu igracaka za te ID-jeve

// - GET /age-group - Lista svih starosnih grupa

// - GET /type - Lista svih kategorija igračaka
 
import axios from 'axios';

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Client-Name': 'ICR'
    },
    validateStatus: (status: number) => {
        return status === 200
    }
})

export class ToyService {
    static async getToys() {
        return client.request({
            url: '/toy',
            method: 'GET',
        })
    }

    static async getToyByPermalink(permalink: string) {
        return client.get(`/toy/permalink/${permalink}`)
    }

    static async getTypes() {
        return client.get('/type')
    }

    static async getAgeGroups() {
        return client.get('/age-group')
    }

}