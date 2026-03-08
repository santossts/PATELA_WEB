import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeguimientoService } from 'app/service/seguimiento.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  departamentos: string[] = [ 'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando' ];
  departamentoSeleccionado: string = '';
  solicitudForm!: FormGroup;
  submitted = false;

  constructor(
     private fb: FormBuilder,
     private solicitudService: SeguimientoService,
     private dialogRef: MatDialogRef<RegistroComponent>
  ) { }

  ngOnInit(): void {

    this.solicitudForm = this.fb.group({ 
      organizacion: ['', Validators.required], 
      remitente: ['', Validators.required], 
      departamento: ['', Validators.required], 
      sector: ['', Validators.required], 
      fechaNota: ['', Validators.required], 
      citeNota: ['', Validators.required],
      referenciaNota: ['', Validators.required]
    });
  }

  guardar(): void { 
    //console.log('Datos del formulario:', this.solicitudForm.value); // aquí puedes enviar al backend o procesar 

    this.submitted = true; 
    
    // marca que intentaste enviar 
    if (this.solicitudForm.invalid) { 
      Swal.fire('Campos requeridos', 'Por favor complete todos los campos obligatorios', 'warning'); 
      return; 
    }

    Swal.fire({ 
      title: '¿Está seguro de guardar?', 
      text: 'Se enviará la información al sistema', 
      icon: 'question', 
      showCancelButton: true, 
      confirmButtonText: 'Sí, guardar', 
      confirmButtonColor: '#f00202',
      cancelButtonText: 'Cancelar' 
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.guardarSolicitud(this.solicitudForm.value).subscribe({ 
          next: (resp) => { 
            Swal.fire('Guardado', 'La solicitud se registró correctamente', 'success') 
            .then(() => { 
              this.dialogRef.close(resp); // cierra el popup y devuelve la respuesta 
            }); 
            console.log('Respuesta del backend:', resp); 
          }, 
          error: (err) => { 
            Swal.fire('Error', 'No se pudo guardar la solicitud', 'error'); 
            console.error(err); } 
          });
      }
    });  
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  convertToUpperCase(event: any){
    setTimeout(() => {
      const input = event.target;
      const upper = input.value.toUpperCase();
      input.value = upper;
      input.setSelectionRange(upper.length, upper.length);
    }, 0);
  }

}
