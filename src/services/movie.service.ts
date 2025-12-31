import axios from 'axios';

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Client-Name': 'KVA/2025'
    },
    validateStatus: (status: number) => {
        return status === 200
    }
})

export class MovieService {
    static async getMovies() {
        return client.request({
            url: '/movie',
            method: 'GET',
        })
    }

    static async getMovieByUrl(shortUrl: string) {
        return client.get(`/movie/short/${shortUrl}`)
    }

    static async getGenres() {
        return client.get('/genre')
    }

    static async getActors() {
        return client.get('/actor')
    }

    static async getDirectors() {
        return client.get('/director')
    }
}