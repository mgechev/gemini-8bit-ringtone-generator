import { Component, HostListener } from "@angular/core";
import { octaves } from "./note-frequencies";
import { KeyValuePipe } from "@angular/common";

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [KeyValuePipe],
  template: `
    @for (octave of octaves; track octave; let idx = $index) {
      <div class="octave">
        @for (note of octave | keyvalue; track note) {
          <div [class.active]="currentNote[0] === note.key && currentNote[1] === idx" class="key" (mousedown)="notePressed({ octave: idx, note: $any(note.key), frequency: $any(note.value) })" (mouseup)="noteReleased()">
            <div>{{note.key}} <sub>{{idx}}</sub></div>
          </div>      
        }
      </div>
    }
  `,
  styleUrl: './keyboard.component.css'
})
export class KeyboardComponent {
  protected octaves = octaves;
  protected currentNote: [string, number] = ['', -1];

  private oscillatorNode: OscillatorNode | null = null;
  private audioContext = new AudioContext()
  private mainGainNode = this.audioContext.createGain();

  ngOnDestroy() {
    this.audioContext.close();
  }

  ngOnInit() {
    this.mainGainNode.connect(this.audioContext.destination);
    this.mainGainNode.gain.value = 100;
  }

  playMelody(melody: [string, number, number][], start = 0) {
    this.noteReleased();
    if (start >= melody.length) {
      return;
    }
    const current = melody[start];
    this.notePressed({
      note: current[0],
      octave: current[1],
      frequency: this.octaves[current[1]][current[0]]
    });
    setTimeout(() => {
      this.playMelody(melody, start + 1);
    }, current[2]);
  }

  protected notePressed(note: { note: string, octave: number, frequency: number }) {
    this.oscillatorNode = this.playTone(note.frequency);
    this.currentNote = [note.note, note.octave];
  }
  
  @HostListener('document:mouseup')
  protected noteReleased() {
    if (this.oscillatorNode) {
      this.oscillatorNode.stop();
    }
    this.currentNote = ['', -1];
  }

  private playTone(freq: number) {
    const osc = this.audioContext.createOscillator();
    osc.connect(this.mainGainNode);
    
    osc.type = 'triangle';
  
    osc.frequency.value = freq;
    osc.start();
  
    return osc;
  }
}
