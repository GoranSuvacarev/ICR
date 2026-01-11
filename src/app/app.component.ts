import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';
import { MessageModel } from '../models/message.model';
import { RasaService } from '../services/rasa.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ToyModel } from '../models/toy.model';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, NgIf, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public service = UserService
  protected year = new Date().getFullYear()
  protected waitingForResponse: boolean = false
  protected botThinkingPlaceholder: string = 'Thinking ...'
  protected isChatVisible: boolean = false
  protected userMessage: string = ''
  protected messages: MessageModel[] = []

  public constructor(private router: Router, public utils: UtilsService) {
    this.messages.push({
      type: 'bot',
      text: 'How can I help you?'
    })
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible
  }

  async sendUserMessage() {
    if (this.waitingForResponse) return

    const trimmedMessage = this.userMessage.trim()
    this.userMessage = ''

    this.messages.push({
      type: 'user',
      text: trimmedMessage
    })
    this.messages.push({
      type: 'bot',
      text: this.botThinkingPlaceholder
    })

    RasaService.sendMessage(trimmedMessage)
      .then(rsp => {
        if (rsp.data.length == 0) {
          console.log(rsp)
          console.log(rsp.data)
          console.log(rsp.status)
          this.messages.push({
            type: 'bot',
            text: "Sorry, I didn't understand your question!"
          })
          return
        }
    
        for (let message of rsp.data) {
          if (message.attachment != null) {
            console.log(message.attachment.type)
            if(message.attachment.type == "all_toys" && Array.isArray(message.attachment.data)) {
              let html = ''
              for (let toy of message.attachment.data) {
                html += `<ul class='list-unstyled'>`
                html += `<li>Title: ${toy.name}</li>`
                html += `<li>Type: ${toy.type.name}</li>`
                html += `<li>Age group: ${toy.ageGroup.name}</li>`
                html += `<li>Target group: ${toy.targetGroup}</li>`
                html += `<li>Price: ${toy.price}</li>`
                const rating = this.utils.calculateRating(toy)
                html += `<li>Rating: ${rating > 0 ? rating : 'No Reviews'}</li>`
                html += `<li>Production date: ${toy.productionDate}</li>`
                html += `</ul>`
                html += `<p>${toy.description}</p>`
                html += `<a href='http://localhost:4200/details/${toy.permalink}'>Details</a>`
              }
              this.messages.push({
                type: 'bot',
                text: html
              })

              continue
            }

            if(message.attachment.type == "search_toy" && Array.isArray(message.attachment.data)) {
              const toys: ToyModel[] = message.attachment.data

              const name = message.attachment.search

              const toy: ToyModel = toys.filter(obj => {
                  return obj.name.toLowerCase().includes(name.toLowerCase())
                })[0]

              if(toy){
                let html = ''
                html += `<ul class='list-unstyled'>`
                html += `<li>Title: ${toy.name}</li>`
                html += `<li>Type: ${toy.type.name}</li>`
                html += `<li>Age group: ${toy.ageGroup.name}</li>`
                html += `<li>Target group: ${toy.targetGroup}</li>`
                html += `<li>Price: ${toy.price}</li>`
                const rating = this.utils.calculateRating(toy)
                html += `<li>Rating: ${rating > 0 ? rating : 'No Reviews'}</li>`
                html += `<li>Production date: ${toy.productionDate}</li>`
                html += `</ul>`
                html += `<p>${toy.description}</p>`
                html += `<a href='http://localhost:4200/details/${toy.permalink}'>Details</a>`
                
                this.messages.push({
                  type: 'bot',
                  text: html
                })
              }

              else{
                this.messages.push({
                  type: 'bot',
                  text: "No toy found"
                })
              }

              continue
            }

            if (message.attachment.type == "filter_toys" && Array.isArray(message.attachment.data)) {

              const toys: ToyModel[] = message.attachment.data

              for (let toy of toys) {
                toy.rating = this.utils.calculateRating(toy)
              }

              const desc = message.attachment.filters.desc
              const type = message.attachment.filters.type
              const age_group = message.attachment.filters.age_group
              var target_group = message.attachment.filters.target_group
              if (target_group != null) {
                if (target_group == "for all") target_group = "svi";
                if (target_group == "boys") target_group = "dečak";
                if (target_group == "girls") target_group = "devojčica";
              }
              const dateFrom = new Date(message.attachment.filters.dateFrom)
              const dateTo = new Date(message.attachment.filters.dateTo)
              const price = message.attachment.filters.price
              const rating = message.attachment.filters.rating

              console.log("desc: " + desc)
              console.log("type: " + type)
              console.log("ageGroup: " + age_group)
              console.log("targetGroup: " + target_group)
              console.log("dateFrom: " + dateFrom)
              console.log("dateTo: "+ dateTo)
              console.log("price: "+ price)
              console.log("rating: " + rating)
              console.log("------")
              
              console.log(toys)

              const filteredToys: ToyModel[] = toys
                .filter(obj => {
                  if (desc == undefined) return true
                  return obj.description.toLowerCase().includes(desc.toLowerCase())
                })
                .filter(obj => {
                  if (type == undefined) return true
                  if (obj.type.name.toLowerCase() == type.toLowerCase()) {
                    return true
                  }
                  return false
                })
                .filter(obj => {
                  if (age_group == undefined) return true
                  if (obj.ageGroup.name == age_group) {
                    return true
                  }
                  return false
                })
                .filter(obj => {
                  if (target_group == null) return true
                  if (obj.targetGroup == target_group) {
                    return true
                  }
                  return false
                })
                .filter(obj => {
                  const date = new Date(obj.productionDate)
                  if (dateFrom && date < dateFrom) return false;
                  if (dateTo && date > dateTo) return false;

                  return true;
                })
                .filter(obj => {
                  if (price === undefined) {
                    return true
                  }
                  if (obj.price <= price) {
                    return true
                  }
                  return false
                })
                .filter(obj => {
                  if (rating === undefined) return true
                  if (obj.rating == rating) {

                    return true
                  }
                  return false
                })

              let html = ''

              for (let toy of filteredToys) {
                html += `<ul class='list-unstyled'>`
                html += `<li>Title: ${toy.name}</li>`
                html += `<li>Type: ${toy.type.name}</li>`
                html += `<li>Age group: ${toy.ageGroup.name}</li>`
                html += `<li>Target group: ${toy.targetGroup}</li>`
                html += `<li>Price: ${toy.price}</li>`
                const rating = this.utils.calculateRating(toy)
                html += `<li>Rating: ${rating > 0 ? rating : 'No Reviews'}</li>`
                html += `<li>Production date: ${toy.productionDate}</li>`
                html += `</ul>`
                html += `<p>${toy.description}</p>`
                html += `<a href='http://localhost:4200/details/${toy.permalink}'>Details</a>`
              }

              if(filteredToys.length === 0){
                this.messages.push({
                  type: 'bot',
                  text: "No toys found"
                })
              }

              else{
                this.messages.push({
                  type: 'bot',
                  text: html
                })
              }
              

              continue
            }

            if(message.attachment.type == "reserve_toy" && Array.isArray(message.attachment.data)) {

              if(this.service.getActiveUser()){
                const toys: ToyModel[] = message.attachment.data

                const name = message.attachment.search

                const toy: ToyModel = toys.filter(obj => {
                    return obj.name.toLowerCase().includes(name.toLowerCase())
                  })[0]

                if(toy){
                  UserService.createReservation({
                    id: new Date().getTime(),
                    name: toy.name,
                    description: toy.description,
                    type: toy.type.name,
                    ageGroup: toy.ageGroup.name,
                    targetGroup: toy.targetGroup,
                    productionDate: toy.productionDate,
                    price: toy.price,
                    status: 'rezervisano',
                    rating: 0
                  })

                  this.messages.push({
                    type: 'bot',
                    text: "Adding to cart"
                  })
                }

                else{
                  this.messages.push({
                    type: 'bot',
                    text: "There is no such toy"
                  })
                }
                
                
              }

              else {
                this.messages.push({
                  type: 'bot',
                  text: "You must be logged in to reserve toys"
                })
              }

              continue
            }
          }
        
          this.messages.push({
            type: 'bot',
            text: message.text
          })
          
        }

        this.messages = this.messages.filter(m => {
          if (m.type === 'bot') {
            return m.text != this.botThinkingPlaceholder
          }
          return true
        })
      })
  }

  public doLogout() {
    localStorage.removeItem('active')
    this.router.navigate(['/'])
  }
}
