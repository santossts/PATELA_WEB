import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
     this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  /*loginForm = this.fb.group({
    username:['', Validators.required],
    password:['', Validators.required]
  });//*/


  ngOnInit(): void {
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  login(){

    if(this.loginForm.invalid){
      Swal.fire({
        icon:'warning',
        title:'Campos requeridos',
        text:'Debe ingresar usuario y contraseña'
      });
      return;
    }

    //console.log("usuario: ", this.loginForm.value);
    this.authService.login(this.loginForm.value) .subscribe({
      next:(resp)=>{
        Swal.fire({
          icon:'success',
          title:'Bienvenido',
          text:'Autenticación correcta',
          timer:1500,
          showConfirmButton:false
        });

        // guardar sesión
        localStorage.setItem(
          'usuario',
          this.loginForm.value.username!
        );

        // redirigir
        this.router.navigate(['/dashboard']);
      },

      error:()=>{

        Swal.fire({
          icon:'error',
          title:'Acceso denegado',
          text:'Usuario o contraseña incorrectos'
        });

      }

    });

  }

}
