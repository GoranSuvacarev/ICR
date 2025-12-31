import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { NgFor, NgIf } from '@angular/common';
import { AxiosError } from 'axios';
import { MovieModel } from '../../models/movie.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {MatOption, MatSelect} from '@angular/material/select';
import {GenreModel} from '../../models/genre.model';
import { ActorModel } from '../../models/actor.model';
import { DirectorModel } from '../../models/director.model';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, MatButtonModule, MatCardModule, LoadingComponent, FormsModule, MatFormFieldModule, MatInputModule, MatSelect, MatOption],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public error: string | null = null;

  public movies: MovieModel[] | null = null;
  public filteredMovies : MovieModel [] | null = null
  
  public genres: GenreModel[] = []
  public genreNames : string[] = []

  public actors: ActorModel[] = []
  public actorNames: string[] = []
  
  public directors : DirectorModel[] = []
  public directorNames : string[] = []

  public selectedActor : string = ''
  public selectedDirector : string = ''
  public genre = ''
  public userInput: string = ''

  constructor(public utils: UtilsService, private router: Router) {
    MovieService.getMovies()
      .then(rsp => {
        this.movies = rsp.data.slice(0,24)
        this.filteredMovies = this.movies
      })
      .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);

    MovieService.getGenres()
      .then(rsp => {
        this.genres = rsp.data;

        for (let genre of this.genres) {
          let name = genre.name;
          this.genreNames.push(name);
        }
      })

      MovieService.getActors()
      .then(rsp => {
        this.actors = rsp.data;

        for (let actor of this.actors) {
          let name = actor.name;
          this.actorNames.push(name);
        }

        this.actorNames.sort()
      })

      MovieService.getDirectors()
      .then(rsp => {
        this.directors = rsp.data;

        for (let director of this.directors) {
          let name = director.name;
          this.directorNames.push(name);
        }
      })
  }

  goToDetails(shortUrl: string) {
    this.router.navigate(['/details', shortUrl]);
  }

  public doFilter() {
    if (this.movies == null) return

    this.filteredMovies = this.movies!
      .filter(obj => {
        if (this.userInput == '') return true
        return obj.title.toLowerCase().includes(this.userInput.toLowerCase())
      })
      .filter(obj => {
        if(this.genre == '') return true
        for(let g of obj.movieGenres){
          if (g.genre.name == this.genre){
            return true
          }
        }
        return false
      })
      .filter(obj => {
        if(this.selectedActor == '') return true
        for(let g of obj.movieActors){
          if (g.actor.name == this.selectedActor){
            return true
          }
        }
        return false
      })
      .filter(obj => {
        if(this.selectedDirector == '') return true
        if(obj.director.name == this.selectedDirector){
          return true
        }
        return false
      })
  }

  resetFilter(){
    this.userInput = ''
    this.genre = ''
    this.selectedActor = ''
    this.selectedDirector = ''
    this.filteredMovies = this.movies
  }
}

