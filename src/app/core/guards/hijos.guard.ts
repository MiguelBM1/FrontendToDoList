import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UsuarioService } from 'src/app/account/services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HijosGuard implements CanActivate {
  constructor(
    private router: Router,
  
    private usuarioService:UsuarioService,

) { }

canActivate(): Observable<boolean>| boolean{
    return this.usuarioService.validarToken().pipe(
        tap(isAuth => {
            if(!isAuth){
                this.router.navigateByUrl('/account/login');
            }
        })
    );
    
}

canLoad(): Observable<boolean>| boolean {
    return this.usuarioService.validarToken().pipe(
        tap(isAuth =>{
            if(!isAuth){
                this.router.navigateByUrl('/account/login');
            }
        })
    );
}
}
