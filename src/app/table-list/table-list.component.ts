import { Component, OnInit, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';
import { MatDialog } from '@angular/material/dialog';
import { RegistroComponent } from 'app/seguimiento/registro/registro.component';
import { FormBuilder } from '@angular/forms';
import { SeguimientoService } from 'app/service/seguimiento.service';
import Swal from 'sweetalert2';
import { redis } from 'googleapis/build/src/apis/redis';
import { SubprocesosComponent } from 'app/seguimiento/subprocesos/subprocesos.component';
import { TareasComponent } from 'app/tarea/tareas/tareas.component';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  @ViewChild('myGrid', { static: true }) myGrid!: jqxGridComponent;
  @ViewChild('menuAcciones', { static: false }) menuAcciones!: jqxMenuComponent;

  //*
  source: any =
        {            
            datatype: 'json',
            localdata: [],
            datafields:
                [
                    { name: 'id', type: 'number' },
                    { name: 'entidad', type: 'string' },
                    { name: 'remitente', type: 'string' },
                    { name: 'departamento', type: 'string' },
                    { name: 'localidad', type: 'string' },
                    { name: 'fechaRegistro', type: 'date' },
                    { name: 'cite', type: 'string' },
                    { name: 'referencia', type: 'string' },
                    { name: 'subproceso', type: 'number'},
                    { name: 'finalizado', type: 'number'}
                ],
                id: 'id'
        };
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }
        return 850;
    }
  dataAdapter: any = new jqx.dataAdapter(this.source);
  columns: any[] =
        [
            { text: 'REG.', datafield: 'id', width: 30 },
            { text: 'ENTIDAD U ORZANIZACION', datafield: 'entidad', width: 200 },
            { text: 'REMITENTE', datafield: 'remitente', width: 200 },
            //{ text: 'DEPARTAMENTO', datafield: 'departamento', columntype: 'checkbox', width: 67, cellsalign: 'center', align: 'center' },
            { text: 'DEPARTAMENTO', datafield: 'departamento', width: 100, cellsalign: 'center', align: 'center' },
            { text: 'LOCALIDAD', datafield: 'localidad', width: 120, align: 'center', cellsalign: 'left' },
            { text: 'SOL.', datafield: 'subproceso', width: 50, align: 'center', cellsalign: 'center' },
            { text: 'FIN.', datafield: 'finalizado', width: 50, align: 'center', cellsalign: 'center' ,
              cellsrenderer: (row, column, value) => { // Si quieres que siempre tenga color 
                let color = value > 0 ? '#7cf37c' : '#ee8080'; // verde si >0, rojo si 0
                return `<div style="background-color:${color}; color:#000; text-align:center; height:100%; display:flex; align-items:center; justify-content:center;">
                        ${value} 
                        </div>`; 
              }
            },
            { text: 'CITE', datafield: 'cite', cellsalign: 'left', align: 'cente', width: 120 },
            { text: 'REFERENCIA', datafield: 'referencia', cellsalign: 'left', align: 'center', width: 200,
              cellsrenderer: (row, column, value) => {                 
                return `<div style="white-space: normal; word-wrap: break-word; line-height: 1em; padding: 5px;">${value}</div>`;
             }
            } ,
            { text: 'FECHA', datafield: 'fechaRegistro', width: 100, align: 'center', cellsalign: 'right' , cellsformat: 'dd/MM/yyyy'},
        ];
  //*/
  constructor(
    private dialog: MatDialog,
    private solicitudService: SeguimientoService
  ) { }

  ngOnInit() {
    this.UpgradeGrilla();
  }

  registroCaso(): void{

    
    //*
    const dialogRef = this.dialog.open(RegistroComponent, {
       width: '700px'
       
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialogo se cerro ', result);
      this.UpgradeGrilla();
    })
      //*/
  }
  UpgradeGrilla(): void {
    this.solicitudService.listarSolicitudes().subscribe({ 
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

  removerFiltro(): void{
    this.myGrid.clearfilters();
  }

  subTarea(): void{
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

    const rowData = this.myGrid.getrowdata(selectedRowIndex);
    const dialogRef = this.dialog.open(SubprocesosComponent, {
       width: '700px',
       data: rowData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialogo se cerro ', result);
      this.UpgradeGrilla();
    })
  }

  Tarea(): void{
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
    const rowData = this.myGrid.getrowdata(selectedRowIndex);
    const dialogRef = this.dialog.open(TareasComponent, {
       width: '800px',
       data: rowData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialogo se cerro ', result);
      this.UpgradeGrilla();
    })   
  }

  reporteExcel(): void{
    Swal.fire({ title: 'Generando reporte...', text: 'Por favor espere', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

     this.solicitudService.descargarReporte().subscribe({
      next: (data: Blob) => {

        const blob = new Blob([data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'solicitudes.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);

        Swal.fire({ icon: 'success', title: 'Reporte generado', text: 'El archivo se descargó correctamente', timer: 2000, showConfirmButton: false });
      },

      error: (err) => { 
        // Cerrar alerta de carga 
        Swal.close(); 
        
        // Mostrar error 
        Swal.fire({ 
          icon: 'error', 
          title: 'Error al generar reporte', 
          text: 'No se pudo descargar el archivo. Intente nuevamente.' 
        }); 
      }
    });
  }

}
