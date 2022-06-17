import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid'

declare var iziToast:any;
declare var $:any;


@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public producto : any = {};
  public id:any;
  public token:any;

  public file:any=undefined;
  public load_btn = false;
  public url:any;
  public load_btn_eliminar = false;

  constructor(
    private _route : ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];

      this.init_data();

      }
    );
   }

  init_data(){
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
  
  ngOnInit(): void {
  }

  fileChangeEvent(event:any):void{
    var file:any;
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];

    }else{
      iziToast.show({
        theme: 'dark',
        backgroundColor: '#9A6EB0',
        titleColor: '#FB0000',
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay una imagen de envio',
        messageColor: '#000000'
    });

    }

    if(file.size <= 4000000000){
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){
    
      this.file = file;

      }else{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#FB0000',
          title: 'ERROR',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen',
          messageColor: '#000000'
      });
      $('#input-img').val('');
      this.file = undefined;
      }
    }else{
      iziToast.show({
        theme: 'dark',
        backgroundColor: '#9A6EB0',
        titleColor: '#FB0000',
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB',
        messageColor: '#000000'
    });
    $('#input-img').val('');
    this.file = undefined;

    }

   console.log(this.file);

  }


  subir_imagen(){
    if(this.file != undefined){
      let data = {
        imagen : this.file,
        _id: uuidv4()
      }
      console.log(data);
      this._productoService.agregar_imagen_galeria_admin(this.id,data,this.token).subscribe(
        response=>{
          this.init_data(); 
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
        message: 'Dede seleccionar una imagen valida',
        messageColor: '#000000'
    });
    }
  }

  eliminar(id:any){
    this.load_btn_eliminar = true;
    this._productoService.eliminar_imagen_galeria_admin(this.id,{_id:id},this.token).subscribe(
      response=>{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#1DC74C',
          title: 'SUCCES',
          class: 'text-succes',
          position: 'topRight',
          message: 'Imagen eliminada con exito.',
          messageColor: '#000000'
      });

      $('#delete-'+id).modal('hide');
      $('.modal-backdrop').removeClass('show');
      
      this.load_btn_eliminar = false;

      this.init_data();

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
        this.load_btn_eliminar = false;
      }
    )
  }


}
