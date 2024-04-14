import { environment } from "src/environments/environment";


const base_url = environment.baseUrl;
export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string, // no necesariamente se tendra el pss aqui
    public img?: string,
    public google?: boolean,
    public rol?:string,
    public uid?: string
  ) {}
  get imagenUrl() {
    if (!this.img) {
      return `${base_url}/upload/usuarios/no-image`;
    } else if (this.img?.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }
  }
}