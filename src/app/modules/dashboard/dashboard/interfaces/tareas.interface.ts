import { environment } from 'src/environments/environment';

const base_url = environment.baseUrl;


export interface ITarea{
 
    id: string
    nombre: string
    descripcion: string
    fechaFinalizacion: string
    estado: string
    persona: string
    codigo: string
    departamento: string
    idEstado: string
    idPersona: string
}

export interface IPersona{
 
    idPersona: string
    nombre: string
    codigo: string

}

export interface IEstado{
 
    idEstado: string
    nombre: string

}