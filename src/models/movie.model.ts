import { ActorModel } from "./actor.model"
import { DirectorModel } from "./director.model"
import { GenreModel } from "./genre.model"

export interface MovieModel {
    movieId: number
    director : DirectorModel
    title: string
    description: string
    shortDescription : string
    poster: string
    startDate : string
    runTime: number
    movieActors : {
        actor : ActorModel
    }[]
    movieGenres: {
        genre : GenreModel
    }[]
    shortUrl : string
}