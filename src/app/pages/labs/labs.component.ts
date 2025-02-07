import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core'; 
import { InjectSetupWrapper } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  title = 'bienvenido  angular 17';

  welcome = "Hola";

  tareas = signal([
    'Instalar',
    'crear proyecto',
    'crear componentes',
    'desplegar'
  ]);

  name = signal('Isaias');

  age = '21';

  disabled = true;

  img = 'https://difusoribero.com/wp-content/uploads/2021/07/meme_famoso.png';

  persona = signal({
    name: 'Carlos',
    age: 19,
    avatar: ''
  })

  clickHandler() {
    alert('Esta es el resultado');
  }

  inputHandler(event: Event){
    console.log(event);
  }

  changeHandler(event: Event){
    // asi es como cambias un valor de una variable con signals de forma dinamica por una funcion
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  keydownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;

    console.log(input.value);
  }

  changeNamePersonaHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    this.persona.update(prevState => {
      return {
        ...prevState,
        name: newValue.toString()
      }
    });
  }

  colorControl = new FormControl();

  widthControl = new FormControl(50, {
    nonNullable: true

  });

  /* con esta funcionalidad sirve para cuando quieres una mensaje de error  de captura */
  nameControl = new FormControl('tu nombre', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor() {
    this.colorControl.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  changeAgeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.persona.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    });
  }
}

