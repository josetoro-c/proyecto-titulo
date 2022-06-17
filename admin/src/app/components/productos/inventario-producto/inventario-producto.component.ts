import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id:any;
  public token:any;
  public _iduser:any;
  public producto : any  = {};
  public inventarios : Array<any>=[];
  public inventario : any = {}; 
  public arr_inventario : Array<any>=[];
  public load_btn = false;

  constructor(
    private  _route : ActivatedRoute,
    private _productoService : ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this._iduser = localStorage.getItem('_id'); 
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];


        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
             
              this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
                response=>{
                  this.inventarios = response.data;
                  this.inventarios.forEach(element => {
                    this.arr_inventario.push({
                      admin: element.admin.nombres + ' ' + element.admin.apellidos,
                      cantidad: element.cantidad,
                      proveedor: element.proveedor
                    });
                  });
                },
                error=>{

                }
              )

            }
          },
          error=>{

          }
        );
      }
    );
  }

  eliminar(id:any){
    this.load_btn = true;
    this._productoService.eliminar_inventario_producto_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#1DC74C',
          title: 'SUCCES',
          class: 'text-succes',
          position: 'topRight',
          message: 'Producto eliminado con exito.',
          messageColor: '#000000'
      });

      $('#delete-'+id).modal('hide');
      $('.modal-backdrop').removeClass('show');
      
      this.load_btn = false;

      this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
        response=>{
          this.inventarios = response.data;
          console.log(this.inventarios);

        },
        error=>{
          console.log(error);
        }
      )

      },
      error=>{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#1DC74C',
          title: 'SUCCES',
          class: 'text-succes',
          position: 'topRight',
          message: 'Error en el servidor.',
          messageColor: '#000000'
        });
        console.log(error);
        this.load_btn = false;
      }
    )
  }

  registro_inventario(inventarioForm:any){
    if(inventarioForm.valid){
      
      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this._iduser,
        proveedor: inventarioForm.value.proveedor
      }

      console.log(data);

      this._productoService.registro_inventario_producto_admin(data,this.token).subscribe(
        response=>{
          iziToast.show({
            theme: 'dark',
            backgroundColor: '#9A6EB0',
            titleColor: '#1DC74C',
            title: 'SUCCES',
            class: 'text-succes',
            position: 'topRight',
            message: 'Nuevo stock agregado.',
            messageColor: '#000000'
         });  

         this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
             
              this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
                response=>{
                  this.inventarios = response.data;
                  this.inventarios.forEach(element => {
                    this.arr_inventario.push({
                      admin: element.admin.nombres + ' ' + element.admin.apellidos,
                      cantidad: element.cantidad,
                      proveedor: element.proveedor
                    });
                  });
                },
                error=>{

                }
              )

            }
          },
          error=>{

          }
        );

        },
        error=>{
          console.log(error);
        }
      )

    }else{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#FB0000',
          title: 'ERROR',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos',
          messageColor: '#000000'
      });
    }
  }

  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }
    let fname='REP01-';
    worksheet.columns = [
      {header : 'Trabajador',key:'col1',width:30},
      {header : 'Cantidad',key:'col2',width:15},
      {header : 'Proveedor',key:'col3',width:25},
    ]as any;

    workbook.xlsx.writeBuffer().then((data)=>{
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob,fname+'-'+new Date().valueOf()+'.xlsx');
    });
  
  }

}
