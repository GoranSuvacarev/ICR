import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { ToyModel } from '../models/toy.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const formattedDate = new Date(date).toLocaleDateString('sr-RS', options);
    return formattedDate ;
  }

  public formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  public showSnackBar(message: string, type: 'success' | 'error', bar: MatSnackBar): void {
    const config = {
      duration: 3000,
      horizontalPosition: 'center' as const,
      verticalPosition: 'top' as const,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    };

    bar.open(message, 'Zatvori', config);
  }

  public calculateRating(toy: ToyModel){
    let rating: number = 0
    let users = UserService.retrieveUsers()
    let reviewCount: number = 0

    for(let user of users){
      for(let reservation of user.reservations){
        if(reservation.rating != 0){
          if(reservation.name == toy.name){
            rating += reservation.rating!
            reviewCount++
          }
        }
      }
    }

    return Math.round(rating/reviewCount)
  }

  public generateChatbotToyDetails(html: String, toy: ToyModel){
    html += `<ul class='list-unstyled'>`
    html += `<li>Title: ${toy.name}</li>`
    html += `<li>Type: ${toy.type.name}</li>`
    html += `<li>Age group: ${toy.ageGroup.name}</li>`
    html += `<li>Target group: ${toy.targetGroup}</li>`
    html += `<li>Price: ${toy.price}</li>`
    const rating = this.calculateRating(toy)
    html += `<li>Rating: ${rating > 0 ? rating : 'No Reviews'}</li>`
    html += `<li>Production date: ${toy.productionDate}</li>`
    html += `</ul>`
    html += `<p>${toy.description}</p>`
    html += `<a href='http://localhost:4200/details/${toy.permalink}'>Details</a>`
    return html;
  }
  
}


