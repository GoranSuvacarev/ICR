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
          this.messages.push({
            type: 'bot',
            text: "Sorry, I didn't understand your question!"
          })
          return
        }

        for (let message of rsp.data) {
          if (message.attachment != null) {
            if (message.attachment.type == "toy_list" && Array.isArray(message.attachment.data)) {

            let html = ''
            for (let toy of message.attachment.data as ToyModel[]) {
              html += `<ul class='list-unstyled'>`
              html += `<li>Title: ${toy.name}</li>`
              html += `<li>Type: ${toy.type.name}</li>`
              html += `<li>Age group: ${toy.ageGroup.name}</li>`
              html += `<li>Target group: ${toy.targetGroup}</li>`
              html += `<li>Price: ${toy.price}</li>`
              const rating = this.utils.calculateRating(toy)
              html += `<li>Rating: ${ rating > 0 ? rating : 'No Reviews' }</li>`
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
             
            this.messages.push({
              type: 'bot',
              text: message.text
            })
          }
        }

        this.messages = this.messages.filter(m => {
          if (m.type === 'bot') {
            return m.text != this.botThinkingPlaceholder
          }
          return true
        })
        
      })
  }

  // async createBotResponseAsToyList(genre: number = 0) {
  //   const toys: { data: ToyModel[] } = await ToyService.getToys();

  //   let html = `<ul class='list-unstyled'>`
  //   toys.data.map(toy => `<li><a href="/movie/${toy.permalink}">${toy.name}</a></li>`)
  //     .forEach(toy => html += toy)
  //   html += `</ul>`

  //   this.messages.push({
  //     type: 'bot',
  //     text: html
  //   })
  //   this.removeBotPlaceholder()
  // }

  // removeBotPlaceholder() {
  //   this.messages = this.messages.filter(m => {
  //     if (m.type === 'bot') {
  //       return m.text != this.botThinkingPlaceholder
  //     }
  //     return true
  //   })
  // }

  public doLogout() {
    localStorage.removeItem('active')
    this.router.navigate(['/'])
  }
}
