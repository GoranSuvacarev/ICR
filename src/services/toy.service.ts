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