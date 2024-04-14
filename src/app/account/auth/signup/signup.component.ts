import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';
import { IS_CLAVE, IS_EMAIL, IS_NAME } from '../../constants/const';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;//loginForm
  submitted = false;//
  error = '';
  successmsg: boolean = false;

   //vivibidad contra
   password: string;
   showPassword: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  // private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,private userService: UserProfileService
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService,
    private usuarioService: UsuarioService) {
      //mi codigo
      /*this.signupForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(IS_EMAIL)]],
        username: ['', [Validators.required, Validators.pattern(IS_NAME)]],
        password: ['', [Validators.required, Validators.pattern(IS_CLAVE)]],
        confirmPassword: ['', [Validators.required, Validators.pattern(IS_CLAVE)]],
      });*/
     }

     /*get f() {
      return this.signupForm.controls;
     }*/
     //Fin mi codigo

  ngOnInit() {
    /*this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });*/
    this.signupForm = this.inciarFormulario();

  }

  /**Iniciar el formulario */
  private inciarFormulario(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(IS_EMAIL)]],
      nombre: ['', [Validators.required, Validators.pattern(IS_NAME)]],
      password: ['', [Validators.required, Validators.pattern(IS_CLAVE)]],
      confirmarPassword: ['', [Validators.required, Validators.pattern(IS_CLAVE)]],
    }, /*{validators: this.clavesSonIguales('password', 'confirmPassword')
    }*/);
  }

  clavesSonIguales(pass1: string, pass2: string){
    //retornamos ua funcion porque los form group recibe
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[pass1];
      const confirmPassword = formGroup.controls[pass2];
      if (password?.value === confirmPassword?.value) {
        confirmPassword.setErrors(null);
      }else {
        confirmPassword.setErrors({ noSonIguales: true});
      }
    }
  }



  // convenience getter for easy access to form fields
  //get f() { return this.signupForm.controls;
  //}

  /**
   * On submit form
   */
  /*onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.register(this.f.email.value, this.f.password.value).then((res: any) => {
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/dashboard']);
          }
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.userService.register(this.signupForm.value)
          .pipe(first())
          .subscribe(
            data => {
              this.successmsg = true;
              if (this.successmsg) {
                this.router.navigate(['/account/login']);
              }
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }*/

  onSubmit(){
    this.submitted =true;
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      this.usuarioService.crearUsuario(this.signupForm.value).subscribe((resp) =>{
        this.router.navigate(['/account/login']);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Guardado con Exito!',
          showConfirmButton: false,
          timer: 2000
        });
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: "Error",
          text: err,
        });
      }
      );
      // console.log("el formulario: ", this.signupForm.value);
      // setTimeout(() => {
      //   this.router.navigate(['/account/login']);
      // }, 3000);
    } else {
      /*Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Algo salió mal!',
      });*/
      /** marcar los campos que no estan correctos */
       return Object.values(this.signupForm.controls)
       .forEach((control) => control.markAsTouched()
       );
    }
  }

  /**Metodo para validar si es campo valido */
  esCampoValido(campo: string){
    const validarCampo = this.signupForm.get(campo);
    return !validarCampo?.valid && validarCampo?.touched? 'is-invalid' :
    validarCampo?.touched ? 'is-valid' : '';
  }

  visibilidadContra(passwordField: HTMLInputElement) {
    this.showPassword = !this.showPassword;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  private passwordsMatch = (_form: FormGroup): boolean => {
    if (_form.controls['password'].touched && _form.controls['confirmPassword'].touched) {
        if (_form.value.password === _form.value.confirmPassword) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

}
