import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SeguimientoService } from 'app/service/seguimiento.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  @ViewChild('myGrid', { static: true }) myGrid!: jqxGridComponent;

    source: any =
        {            
            datatype: 'json',
            localdata: [],
            datafields:
                [
                    { name: 'id', type: 'number' },
                    { name: 'detalle', type: 'string' },
                    { name: 'estado', type: 'string' },
                    { name: 'fechaRegistro', type: 'date' },
                    { name: 'fechaModificacion', type: 'date' },                    
                ],
                id: 'id'
        };
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }
        return 850;
    }
  columns: any[] =
        [
            { text: 'REG.', datafield: 'id', width: 30 },
            { text: 'DETALLE SOLICITUD', datafield: 'detalle', width: 200, align:'center',
              cellsrenderer: (row, column, value): string => {
                  return `<div style="height:100%; display: flex; align-items: flex-end; justify-content: center; white-space: normal; word-break: break-word: padding: 2px; font-weight: bold; padding-left: 5px;" title="${value}" style="padding:4px;">${value}</div>`;
                }
            },
            { text: 'ESTADO', datafield: 'estado', width: 90, align:'center' ,
              cellsrenderer: (row, column, value) => {
                  if (value === 'FINALIZADO') {
                    return `<span style="color:green;font-weight:bold">✔ FINALIZADO</span>`;
                  }
                  return value;
                }
             },
            { text: 'REGISTRO', datafield: 'fechaRegistro',  width: 80, cellsalign: 'center', align: 'center', cellsformat: 'dd/MM/yyyy' },
            { text: 'FINALIZADO', datafield: 'fechaModificacion', width: 80, cellsalign: 'center', align: 'center', cellsformat: 'dd/MM/yyyy' },
        ];
  dataAdapter: any = new jqx.dataAdapter(this.source);
      
  constructor(
    private solicitudService: SeguimientoService,
    public dialogRef: MatDialogRef<TareasComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
    this.UpgradeGrilla();
  }

  UpgradeGrilla(): void{
    this.solicitudService.listaDeSubtareas(this.data.id).subscribe({ 
      next: (data) => { 
        //console.log(data);
        this.source.localdata = data; 
        this.dataAdapter = new jqx.dataAdapter(this.source); 
        this.myGrid.updatebounddata(); 
        // refresca la grilla 
      }, error: (err) => { 
        console.error('Error al cargar solicitudes', err); 
      } 
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  finalizar(): void {
    const selectedRowIndex = this.myGrid.getselectedrowindex();
    if(selectedRowIndex < 0){
          Swal.fire({
            icon: 'warning',
            title: 'Sin Selección',
            text: 'Debe seleccionar un registro para continuar',
            confirmButtonColor: '#19b6ffff',
            confirmButtonText: 'Entendido'
          });
          return;      
    }

     // ✅ obtener fila seleccionada
    const rowData = this.myGrid.getrowdata(selectedRowIndex);

    // ✅ NUEVA VALIDACIÓN IMPORTANTE
    if (rowData.estado === 'FINALIZADO') {

      Swal.fire({
        icon: 'info',
        title: 'Proceso ya finalizado',
        text: 'El registro seleccionado ya se encuentra FINALIZADO',
        confirmButtonColor: '#3085d6'
      });

      return; // 🚫 bloquea proceso
    }

    // ✅ alerta confirmación
    Swal.fire({
      icon: 'question',
      title: 'Confirmar acción',
      text: '¿Está seguro de finalizar/modificar el registro seleccionado?',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       this.solicitudService.finalizarRegistro(rowData.id)
        .subscribe({
          next: (resp) => {

            Swal.fire({
              icon: 'success',
              title: 'Proceso realizado',
              text: 'Registro actualizado correctamente',
              timer: 2000,
              showConfirmButton: false
            });

            // ✅ refrescar grid
            this.UpgradeGrilla();

          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el registro'
            });
          }
        });
      }  
    });
      
  }

}
