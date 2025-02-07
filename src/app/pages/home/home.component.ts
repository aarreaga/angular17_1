import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

// aqui se importan los modelos 
import { Tarea } from './../../models/tarea.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // este mecanismo sirve para 
  /*
  El inyector es un mecanismo que facilita la interacción entre los proveedores y consumidores de dependencias. 
  Cuando se solicita una dependencia, el inyector verifica si ya existe una instancia disponible. Si no, crea una nueva instancia 
  y la almacena en el registro. 

  */
  injector = inject(Injector);

  // este bloque se ejecuta al inicializar el componente y verifca, en este caso, ejecuta una proceos para leer el local storage
  ngOnInit(){

    const storage = localStorage.getItem('tareas');
    if (storage){
        const tareas = JSON.parse(storage);
        this.tareas.set(tareas);
    }

    this.trackTasks();
  }

  trackTasks(){
    // a diferencia del computed, ese si retorna una nueva instancia a partir de otras desde reactividad
    // effect: no retorna objetos pero si vigila y ejecuta una reactividad en caso que un estado cambia o ejecuta otra
    // funcion como dependencia del mismo
    effect( ()=> {
      const tasks = this.tareas();
      console.log(this.tareas);
      localStorage.setItem('tareas', JSON.stringify(tasks));
    }, { injector: this.injector })
  }

  tareas = signal<Tarea[]>([]);

  // esto restringe que solo ciertos elementos tipo string puedan ingresar a la funcion
  filter = signal<'all' | 'pending' | 'completed'>('all');

  tareasbyfilter = computed(() => {

    const filter = this.filter();
    const tareas = this.tareas();

      switch(filter)
      {
        case 'all':
          return tareas;
        break;

        case 'pending':
          return tareas.filter(task => !task.completed);
        break;

        case 'completed':
          return tareas.filter(task => task.completed);
        break;
      }

      return tareas;
  }) 

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  changeHandler() {
    if (this.newTaskControl.valid){
      const value = this.newTaskControl.value.trim();
      if (value != ''){
        this.addTarea(value);
        this.newTaskControl.setValue('');  
      }
    }
  }

  addTarea(title: string) {
    const newTarea = {
      id: Date.now(),
      title,
      completed: false,
    }

    this.tareas.update((tareas) => [...tareas, newTarea]);
  }

  deleteTarea(index: number) {
    this.tareas.update((tareas) => tareas.filter((task, position) => position !== index));
  }

  updateTarea(index: number){
    this.tareas.update((tareas) => {
      return tareas.map((task, position) => {
        if (position === index){
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    });
  }

  updateTaskEditingMode(index: number){
    this.tareas.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index){
          return {
            // se activa en edicion una
            ...task,
            editing: true
          }
        }
        return {
          // pero todas las demas se desactivan y solo permite una opcion de la lista en forma edicion
          ...task,
          editing: false
        };
      })
    });
  }  

  // este evento realiza la acutalizacion del elemento que se editar y se guarda en la lista
  updateTaskText(index: number, event: Event){

    const input = event.target as HTMLInputElement;
    this.tareas.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index){
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    });
  }  

  // la funcion que manda llamar la propiedad computed, solo puede recibir ciertos valores
  changeFilter(filter: 'all' | 'pending' | 'completed'){
    this.filter.set(filter);
  }

}
