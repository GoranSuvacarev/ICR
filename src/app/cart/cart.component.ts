import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router} from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { TicketModel } from '../../models/ticket.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {UtilsService} from '../../services/utils.service';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  imports: [NgIf,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  public displayedColumns: string[] = ['title', 'runTime', 'scheduledAt', 'price', 'actions'];
  public activeUser: UserModel | null = null
  public cart: TicketModel[] | null = null
  public totalPrice : number = 0


  constructor(private router: Router, public utils: UtilsService, public snackBar: MatSnackBar) {
    if (!UserService.getActiveUser()) {
      router.navigate(['/home'])
      return
    }

    this.loadCart()
  }

  public doPay(ticket: TicketModel) {
    for (let movie of this.activeUser!.tickets.filter(ticket => ticket.status === "watched")) {
      if(ticket.title == movie.title){
        this.doCancel(ticket)
        return
      }
    }

    if (UserService.changeTicketStatus(ticket.id, ticket.title)) {
      this.loadCart()
      this.utils.showSnackBar('Karta za ' + ticket.title + ' je uspešno kupljena', 'success', this.snackBar);
    }
  }

  public doCancel(ticket: TicketModel) {
    const arr = UserService.retrieveUsers()
    for (let user of arr) {
      if (user.email == this.activeUser!.email) {
        user.tickets = this.activeUser?.tickets.filter(currentticket => currentticket.id !== ticket.id) || []
        localStorage.setItem('users', JSON.stringify(arr))
      }
    }

    this.loadCart()
    this.utils.showSnackBar('Rezervacija za ' + ticket.title + ' je otkazana', 'error', this.snackBar );
  }

  public loadCart(){
    this.activeUser = UserService.getActiveUser()
    this.cart = this.activeUser?.tickets.filter(ticket => ticket.status === "booked") || [];
    this.totalPrice = 0
    for(let ticket of this.cart!){
      this.totalPrice += ticket.price
    }
  }
}
