import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IEstado, IPersona, ITarea } from './interfaces/tareas.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TareasService } from './service/tareas.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { title } from 'process';
const base_url = environment.baseUrl;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  filtroEstado: string = '';
  modalRef: NgbModalRef;

  breadCrumbItems: Array<{}>;

  tareas: ITarea[] = [];
  formTarea!:FormGroup;
  submitted:boolean=false;
  TareaSeleccionada:ITarea=null;

  public personas: IPersona[] = [];
  public estados: IEstado[] = [];
 
  constructor(private fb:FormBuilder,private tareaService: TareasService,private modalService:NgbModal) { }

  async ngOnInit()  {
    this.breadCrumbItems = [{ label: 'Tareas' }, { label: 'Listar', active: true }];//Migas de pan
    this.initForm();
  await  this.getTareas();
   // this.llenarComboPersonas();
   await this.llenarComboPersonas();

    await this.llenaComboEstados();
   return;
  }

  initForm(){
    this.formTarea = this.fb.group({

      nombre:['',[Validators.required]],
      descripcion: ['',[Validators.required]],
      fechaFinalizacion: ['',[Validators.required]],
      persona: ['',[Validators.required]],
      estado: ['',[Validators.required]],
    });
    
  }
 
  async getTareas(){

  this.tareaService.getTareas().subscribe((response: ITarea[]) => {
  this.tareas = response;
    });
  }

  paraAgregar(content: any){
    this.initForm();
    this.submitted = false;
    this.TareaSeleccionada = null;
    this.modalService.open(content);
    
  }

  paraEditar(content: any, tarea: ITarea){
  
    this.TareaSeleccionada = tarea;
   // tarea.estado = this.TareaSeleccionada.idEstado;
    //tarea.persona = this.TareaSeleccionada.idPersona;
    this.formTarea.patchValue({
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      fechaFinalizacion: tarea.fechaFinalizacion,
      persona: tarea.idPersona,
      estado: tarea.idEstado,
    
    })

    Object.keys(this.formTarea.controls).forEach(controlName => {
      this.formTarea.get(controlName).markAsUntouched();
    });
    console.log(this.formTarea.value);
    this.modalService.open(content);
    
    
    
  } 

  paraEditarEstado(tarea: ITarea){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro de marcar como completada la tarea?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, completar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareaService.editarEstadoTarea(tarea).subscribe(resp =>{
          Swal.fire('Completada!','La tarea ha sido completada con exito.','success');
          
          this.getTareas();
        },
        (err:any)=>{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Error al cambiar el estado hable con el admin',
          });
        });
      } else if ( result.isDenied) {
        Swal.fire('Cancelado','El estado de tu tarea se ha mantenido','info');
      }
  });
  }
    


  guardarTarea(){
    if(this.formTarea.valid){
      if(this.TareaSeleccionada == null){
        Swal.fire({
          position:'center',
          title:'Buen trabajo!',
          text:'submit disparado , formulario es valido',
          icon: 'info',
        });
        console.log(this.formTarea.value);
  
        this.registrarTarea();

      }else{
        this.editarTarea();
      }
    }else{
      Swal.fire({
        position:'center',
        title:'Faltan datos en el formulario',
        text:'submit disparado, formulario No valido',
        icon: 'warning',
      });

      return Object.values(this.formTarea.controls)
      .forEach((control)=> control.markAsTouched()
      );
    }
    this.modalService.dismissAll();
    this.submitted == true;
  }

  registrarTarea(){
    const tarea: ITarea = this.formTarea.value;
  // this.tareaService.agregarTarea(tarea).subscribe(resp =>{
   this.tareaService.agregarTarea(tarea).subscribe(resp =>{
     if(resp){
       Swal.fire({
         position:'center',
         title:'Buen trabajo',
         text:'Datos guardados con exito',
         icon:'info',
       });
       
       this.getTareas();
     }
   },(err:any)=>{
     Swal.fire({
       icon:'error',
       title:'Error',
       text:'Error al registrar hable con el admin',
     });
   });
  
   
 }

  editarTarea(){
  
    const tarea: ITarea = this.formTarea.value;
    tarea.id = this.TareaSeleccionada.id;
    this.tareaService.editarTarea(tarea).subscribe(resp =>{
      if(resp){
        Swal.fire({
          position:'center',
          title:'Buen trabajo',
          text:'Datos actualizados con exito',
          icon:'info',
        });
        this.getTareas();
      }
    },(err:any)=>{
      Swal.fire({
        icon:'error',
        title:'Error',
        text:'Error al registrar hable con el admin',
      });
    });
  
  }
  

 esCampoValido(campo:string){

  const validarCampo = this.formTarea.get(campo);
  return !validarCampo?.valid && validarCampo?.touched
  ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
}

async llenarComboPersonas(){
  this.tareaService.getPersonas().subscribe(
    (response: IPersona[]) => {
      this.personas = response;
    },
    (error) => {
      console.error('Error al obtener personas:', error);
    }
  );
}

async llenaComboEstados(){
  this.tareaService.getEstados().subscribe(
    (response: IEstado[]) => {
      this.estados = response;
    },
    (error) => {
      console.error('Error al obtener estados:', error);
    }
  );
  }

  borrarTarea(tarea: ITarea, i: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro de eliminar ?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareaService.eliminarTarea(tarea).subscribe(resp =>{
          Swal.fire('Eliminado!','La tarea ha sido eliminada.','success');
          
          this.getTareas();
        },
        (err:any)=>{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Error al eliminar hable con el admin',
          });
        });
      } else if ( result.isDenied) {
        Swal.fire('Cancelado','Tu tarea esta segura','info');
      }
  });
      
  }


  filtrarTareasPorEstado(estadoId: string): ITarea[] {
    let tareasFiltradas: ITarea[] = [];
  
  // Filtrar por estado
  if (!estadoId) {
    tareasFiltradas = this.tareas; // Si no se ha seleccionado un estado, devuelve todas las tareas
  } else {
    tareasFiltradas = this.tareas.filter(tarea => tarea.idEstado === estadoId);
  }

  // Ordenar por fecha de finalización ascendente (de las más cercanas a vencer a las más lejanas)
  tareasFiltradas.sort((a, b) => {
    const fechaA = new Date(a.fechaFinalizacion).getTime();
    const fechaB = new Date(b.fechaFinalizacion).getTime();
    return fechaA - fechaB;
  });

  return tareasFiltradas;
  }

}
