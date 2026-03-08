import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SeguimientoService } from 'app/service/seguimiento.service';

@Component({
  selector: 'app-subprocesos',
  templateUrl: './subprocesos.component.html',
  styleUrls: ['./subprocesos.component.css']
})
export class SubprocesosComponent implements OnInit {

  solicitudForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SubprocesosComponent>,
    private solicitudService: SeguimientoService, 
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
     this.solicitudForm = this.fb.group({ 
        organizacion: ['', Validators.required],
      });
  }

  cerrar(): void { 
    this.dialogRef.close('cerrado desde subproceso'); 
  }

  guardar(): void{
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
        //console.log("cargando: ", this.solicitudForm.value)
          if (result.isConfirmed) {
             this.solicitudService.almacenarSubProcesos(this.solicitudForm.value, this.data.id).subscribe({ 
                      next: (resp) => { 
                        Swal.fire({
                          title: 'Guardado', 
                          text: 'La solicitud se registró correctamente', 
                          icon: 'success', 
                          timer: 2000, // ⏱ se cierra en 2 segundos 
                          timerProgressBar: true, // barra de progreso 
                          showConfirmButton: false // ⏱ se cierra en 2 segundos                           
                          }
                        ) 
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

  convertToUpperCase(event: any){
    setTimeout(() => {
      const input = event.target;
      const upper = input.value.toUpperCase();
      input.value = upper;
      input.setSelectionRange(upper.length, upper.length);
    }, 0);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}
