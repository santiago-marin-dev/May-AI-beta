import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

interface Mensaje {
  rol: string;
  contenido: string;
  hora: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements AfterViewChecked, OnInit {
  pregunta: string = '';
  mensajes: Mensaje[] = [];
  escribiendo: boolean = false;
  maxCaracteres: number = 500;

  @ViewChild('mensajesDiv') mensajesDiv!: ElementRef;

  ngOnInit() {
    this.mensajes.push({ 
      rol: 'ia', 
      contenido: 'Hola, soy May ♡ ¿en qué puedo ayudarte hoy?',
      hora: this.getHora()
    });
  }

  ngAfterViewChecked() {
    this.mensajesDiv.nativeElement.scrollTop = this.mensajesDiv.nativeElement.scrollHeight;
  }

  getHora(): string {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  limpiarChat() {
    this.mensajes = [];
    this.mensajes.push({ 
      rol: 'ia', 
      contenido: 'Hola, soy May ♡ ¿en qué puedo ayudarte hoy?',
      hora: this.getHora()
    });
  }

  async enviar() {
    if (!this.pregunta.trim()) return;

    this.mensajes.push({ rol: 'usuario', contenido: this.pregunta, hora: this.getHora() });
    const preguntaActual = this.pregunta;
    this.pregunta = '';
    this.escribiendo = true;

    const respuesta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres May, una IA con personalidad tranquila y detallista. Hablas con cariño pero sin exagerar, eres sutil y elegante en tus respuestas. Te gustan los detalles pequeños y significativos. Nunca eres fría pero tampoco dramática. Respondes de forma corta y cálida.'
          },
          { role: 'user', content: preguntaActual }
        ]
      })
    });

    const data = await respuesta.json();
    this.escribiendo = false;
    this.mensajes.push({ rol: 'ia', contenido: data.choices[0].message.content, hora: this.getHora() });
  }
}