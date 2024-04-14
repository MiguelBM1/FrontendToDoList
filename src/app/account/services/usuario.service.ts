import { Injectable, NgZone, inject } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IRegistroUsuario } from '../interfaces/registro-usuario';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { ILoginUsuario } from '../interfaces/login-usuario';
import { Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  storage: Storage = window.localStorage;
  public usuario!: Usuario;
  private http = inject(HttpClient);//otra forma de injectar
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private Cookies: CookieService
  
  ) { }

  /** Creacion de usuario */
  crearUsuario(forData: IRegistroUsuario){
    console.log();
    return this.http.post(`${base_url}/usuarios`, forData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  /** Para guardar el localStorage del navegador */
  guardarLocalStorage(token: string, menu: any){
    this.storage.setItem('token', token);
    this.storage.setItem('menu', JSON.stringify(menu));
  }

  /** Para obtener el token del loscalStorage */
  get token(): string {
    return this.storage.getItem("token") || "";
  }

  /** Para autenticar entrada */
  login(formData: ILoginUsuario){
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
        //this.setTokenCookies(resp.token);
        const user = resp;
        return user;
      }),
      catchError(err => {
        return throwError('Error inesperado');
      })
    );
  }

  /** */

  logout() {
     this.storage.removeItem('token');
     this.storage.removeItem('menu');
   // this.Cookies.deleteAll();
     this.ngZone.run(() => {
       this.router.navigateByUrl('/account/login');
     });
   }

  private setTokenCookies(token:string){
    return this.Cookies.set('token',token);

  }
  private get TokenCookies(){
    return this.Cookies.get("token");
  }

  validarToken():Observable<boolean>{
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token': this.token,
      },
    }).pipe(
      map((resp:any)=>{
        const {email,google,img,nombre,rol,uid}=resp.usuario;
        this.usuario = new Usuario(nombre,email,"",img,google,rol,uid);
        this.guardarLocalStorage(resp.token,resp.menu);
        //this.setTokenCookies(resp,token);
        return true;
      }),
      catchError((error) => of(false))
    );

  }

  get rol(): "ADMIN_ROLE" | "USER_ROLE" |string {
    return this.usuario.rol;
  }

  async actualizarFoto(archivo:File,tipo:'usuarios',id:string){
    try{
      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen',archivo);
      const resp = await fetch(url,
        {
          method:'PUT',
          headers: {'x-token':localStorage.getItem('token') ||  ''}, body: formData

        });
        const data = await resp.json();
        if(data.ok){
          return data.nombreArchivo;

        }else{
          return false;
        }

    }catch(error){
      return false;
    }
  }

}
