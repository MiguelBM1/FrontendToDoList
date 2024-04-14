import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { IS_CLAVE, IS_EMAIL, IS_NAME } from '../../constants/const';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  storage: Storage = window.localStorage;
  loginForm: FormGroup;
  submitted: boolean = false;
  error: string = '';
  returnUrl: string;

  //vivibidad contra
  password: string;
  showPassword: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.loginForm = this.inciarFormularioLogin();

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
   // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  /*onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/dashboard']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/dashboard']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }*/


  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      /** marcar los campos que no estan correctos */
      // return Object.values(this.loginForm.controls)
      // .forEach((control) => control.markAsTouched()
      // );
      return;
    }
      this.usuarioService.login(this.loginForm.value).subscribe(
        (resp) => {
          if (this.loginForm.get('remember')?.value) {
            this.storage.setItem('email', this.loginForm.get('email')?.value);
          } else {
            this.storage.removeItem('email');
          }
          this.router.navigate(['/dashboard']);
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err
          })
        }
      )
      /*Swal.fire({
        position: 'center',
        title: 'Faltan datos en el formulario',
        text: 'Formulario no valido',
        icon: 'warning'
      });*/
  }


  /**Metodo para validar si es campo valido */
  esCampoValido(campo: string){
    const validarCampo = this.loginForm.get(campo);
    return !validarCampo?.valid && validarCampo?.touched? 'is-invalid' :
    validarCampo?.touched ? 'is-valid' : '';
  }

  /**Iniciar el formulario */
  private inciarFormularioLogin(): FormGroup {
    return this.formBuilder.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.pattern(IS_EMAIL)]],
      // [Validators.required, Validators.pattern(IS_CLAVE)]
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(IS_CLAVE)]],
      remember: [false]
    });
  }


  visibilidadContra(passwordField: HTMLInputElement) {
    this.showPassword = !this.showPassword;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

}
