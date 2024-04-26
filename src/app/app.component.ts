import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeyboardComponent } from './keyboard.component';
import { GoogleGenerativeAI } from '@google/generative-ai';

const basePrompt = `
Generate a melody with 15 to 60 notes where each note is represented with one of the symbols
A, A#, B, C, C#, D, D#, E, F, F#, G, G#, an octave between 0 and 9, and a duration in milliseconds for which it should be played.

Output the result as a JSON array of triples where the first element of the triple is the note, the second is the octave, and the third is the duration in milliseconds.
In your response return only the JSON array without any additional strings before and after.

The melody should be about: `;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KeyboardComponent],
  template: `

    <h1>8 bit Ringtone Generator</h1>

    <input placeholder="API key" #apiKey value="" class="input"><br>

    <input placeholder="Prompt..." #prompt class="input">&nbsp;<button [disabled]="loading" class="button" (click)="generateTune(prompt.value); prompt.value = ''">
      @if (loading) {
        Loading...
      } @else {
        Generate
      }
    </button>
    <br>
    <app-keyboard/>
  `,
  styleUrl: 'app.component.css'
})
export class AppComponent {
  protected keyboard = viewChild.required(KeyboardComponent);
  protected apiKey = viewChild.required<ElementRef<HTMLInputElement>>('apiKey');
  protected loading = false;

  async generateTune(prompt: string) {
    prompt = basePrompt + prompt;

    const genAI = new GoogleGenerativeAI(this.apiKey().nativeElement.value);

    const model = genAI.getGenerativeModel({
      model: 'gemini-pro'
    });
    
    this.loading = true;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      const tune = JSON.parse(text.replace('```js', '').replace('```javascript', '').replace('```json', '').replace('```', ''));
  
      this.keyboard().playMelody(tune);
    } finally {
      this.loading = false;
    }
  }
}
