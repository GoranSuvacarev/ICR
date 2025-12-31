import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { NgIf } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { AxiosError } from 'axios';
import { NgFor } from '@angular/common';
import {UtilsService} from '../../services/utils.service';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-details',
  imports: [NgIf, LoadingComponent, MatCardModule, MatListModule, MatButtonModule, NgFor, RouterLink, MatSnackBarModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  public movie: MovieModel | null = null
  public error: string | null = null
  isDescriptionExpanded: boolean = false;
  maxDescriptionLength: number = 800;

  public constructor(private route: ActivatedRoute, public utils: UtilsService, private snackBar: MatSnackBar) {
    route.params.subscribe(params => {
      MovieService.getMovieByUrl(params['shortUrl'])
        .then(rsp => {
          this.movie = rsp.data
        })
        .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`)
    })
  }

  public bookTicket(time : string ,price : number) {
    const result = UserService.createTicket({
      id: new Date().getTime(),
      title: this.movie!.title,
      runTime: this.movie!.runTime,
      scheduledAt: this.utils.formatDate(this.movie!.startDate) + " " + time,
      price : price,
      status: 'booked',
      rating : null
    })

    if (result) {
      this.utils.showSnackBar('Film uspešno dodat u korpu', 'success', this.snackBar);
    } else {
      this.utils.showSnackBar('Morate biti ulogovani kako biste rezervisali kartu', 'error', this.snackBar);
    }
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  getTruncatedDescription(): string {
    if (!this.movie || !this.movie.description) {
      return '';
    }

    if (this.isDescriptionExpanded || this.movie.description.length <= this.maxDescriptionLength) {
      return this.movie.description;
    } else {
      return this.movie.description.substring(0, this.maxDescriptionLength) + '...';
    }
  }

  shouldShowMoreButton(): boolean {
    return Boolean(this.movie?.description &&
      this.movie.description.length > this.maxDescriptionLength);
  }

  calculateRating(){
    let rating : number = 0
    let users = UserService.retrieveUsers()
    let reviewCount : number = 0

    for(let user of users){
      for(let ticket of user.tickets){
        if(ticket.rating != 0){
          if(ticket.title == this.movie!.title){
            rating += ticket.rating!
            reviewCount++
          }
        }
      }
    }

    if(rating == 0){
      return "Nema recenzija"
    }

    return rating/reviewCount + "/5"
  }
}
