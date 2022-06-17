import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast:any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  public producto : any = {};
  public id:any;
  public token:any;

  public nueva_variedad = '';
  public load_btn = false;
  public url:any;

  constructor(
    private _route : ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];


        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
            }
            console.log(this.producto);
          },
          error=>{

          }
        );
      }
    );
   }

  ngOnInit(): void {
  }

  agregar_variedad(){
    if(this.nueva_variedad){
      this.producto.variedades.push({titulo:this.nueva_variedad});
      this.nueva_variedad = '';
    }else{
      iziToast.show({
        theme: 'dark',
        backgroundColor: '#9A6EB0',
        titleColor: '#FB0000',
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message: 'Completar el titulo de la Variedad',
        messageColor: '#000000'
      });
    }
  }

  eliminar_variedad(idx:any){
    this.producto.variedades.splice(idx,1);
  }

  actualizar(){
    if(this.producto.titulo_variedad){
        
      if(this.producto.variedades.length >= 1){
        // actualizar
        this.load_btn = true;
        this._productoService.actualizar_producto_variedades_admin({
           titulo_variedad: this.producto.titulo_variedad,
           variedades : this.producto.variedades
        },this.id,this.token).subscribe(
          response=>{
            console.log(response);

            iziToast.show({
              theme: 'dark',
              backgroundColor: '#9A6EB0',
              titleColor: '#1DC74C',
              title: 'SUCCES',
              class: 'text-succes',
              position: 'topRight',
              message: 'Se actualizó correctamente las variedades.',
              messageColor: '#000000'
            }); 

            this.load_btn = false;

          }
        );
      }else{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#FB0000',
          title: 'ERROR',
          class: 'text-danger',
          position: 'topRight',
          message: 'Se debe agregar al menos una variedad',
          messageColor: '#000000'
        });
      }

    }else{
      iziToast.show({
        theme: 'dark',
        backgroundColor: '#9A6EB0',
        titleColor: '#FB0000',
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message: 'Completar el titulo de la Variedad',
        messageColor: '#000000'
      });
    }
  }

}
