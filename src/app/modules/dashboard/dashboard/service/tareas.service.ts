import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITarea } from '../interfaces/tareas.interface';


@Injectable({
  providedIn: 'root'
})
export class TareasService {

  url = environment.baseUrl;
  constructor(private http: HttpClient)
  { }

  public getTareas(): Observable<any>{
    
    return this.http.get<any>(this.url+"tarea");

  }  

  public tareaById(tarea: ITarea): Observable<any> {
    return this.http.get<any>(this.url + "tarea/" + `${tarea.id}`);
  }

  agregarTarea(tarea: ITarea){
    const url = `${this.url}tarea`;
    return this.http.post(url, tarea);
  }

  editarTarea(tarea: ITarea){
    const url = `${this.url}tarea/${tarea.id}`;
    return this.http.put(url, tarea);
  }

  eliminarTarea(tarea: ITarea){
    const url = `${this.url}tarea/${tarea.id}`;
    return this.http.delete(url);
  }


  getPersonas(): Observable<any>{
    return this.http.get<any>(this.url+"tarea/personas");
  }  

    getEstados(): Observable<any>{
      return this.http.get<any>(this.url+"tarea/estados");
    }

    editarEstadoTarea(tarea: ITarea){
      const url = `${this.url}tarea/estado/${tarea.id}`;
      return this.http.put(url, tarea.id);
    }
    
    
}
