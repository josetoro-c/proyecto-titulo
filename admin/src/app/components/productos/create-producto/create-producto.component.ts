import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var jQuery:any;
declare var $:any; 
declare var iziToast:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto : any = {
    categoria: ''
  };

  public file:any=undefined;
  public imgSelect:any | ArrayBuffer = 'assets/img/01.jpg';
  public config : any = {};
  public token:any;
  public load_btn = false;
  public config_global: any = {};

  constructor(
    private _productoService : ProductoService,
    private _adminService : AdminService,
    private __router : Router
  ) {
    this.config = {
      height: 500
    }
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_publico().subscribe(
      response=>{
        this.config_global = response.data;   // aqui se almacenan las categorias
        console.log(this.config_global);
      }
    )
  }

  ngOnInit(): void {
  }

  registro(registroForm:any){
    if(registroForm.valid){
      if(this.file == undefined){
      iziToast.show({
        theme: 'dark',
        backgroundColor: '#9A6EB0',
        titleColor: '#FB0000',
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debes subir una portada para registrar',
        messageColor: '#000000'
      });
      }else{
        console.log(this.producto);
        console.log(this.file);
        this.load_btn = true;
        this._productoService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
          response=>{
            iziToast.show({
              theme: 'dark',
              backgroundColor: '#9A6EB0',
              titleColor: '#1DC74C',
              title: 'SUCCES',
              class: 'text-succes',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo producto.',
              messageColor: '#000000'
          });        
          this.load_btn = false;
          this.__router.navigate(['/panel/productos']);
  
          },
          error=>{
            console.log(error);
            this.load_btn = false;
  
          }
        );
      }

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
    this.load_btn = false;
    
    $('#input-portada').text('Seleccionar imagen');
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;

    }
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

      const reader = new FileReader();
      reader.onload = e => this.imgSelect = reader.result;
      console.log(this.imgSelect);

      reader.readAsDataURL(file);

      $('#input-portada').text(file.name);

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
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
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
    $('#input-portada').text('Seleccionar imagen');
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;

    }

   console.log(this.file);

  }

}
