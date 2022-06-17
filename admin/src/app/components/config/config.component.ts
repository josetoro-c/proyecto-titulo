import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { v4 as uuidv4 } from 'uuid'

declare var iziToast:any;
declare var jQuery:any;
declare var $:any; 

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token:any;
  public config : any = {};
  public url:any; 

  public titulo_cat = '';
  public icono_cat ='';
  public file:any=undefined;
  public imgSelect :any | String | ArrayBuffer;

  constructor(
    private _adminService : AdminService
    
    ) { 
      this.token = localStorage.getItem('token');
      this.url = GLOBAL.url;
      this._adminService.obtener_config_admin(this.token).subscribe(
        response=>{
          this.config = response.data;
          this.imgSelect = this.url+'obtener_logo/'+this.config.logo;
          console.log(this.config);
        },
        error=>{
          console.log(error);
        }
      )
    }

  ngOnInit(): void {
  }

  agregar_cat(){
    if(this.titulo_cat && this.icono_cat){
       this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
          _id: uuidv4()
       });

       this.titulo_cat = '';
       this.icono_cat = '';

    }else{
      iziToast.show({
        theme: 'dark',
        backgroundColor: '#9A6EB0',
        titleColor: '#FB0000',
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un titulo e icono para la categoria',
        messageColor: '#000000'
      });
    }
  }

  actualizar(confForm:any){
    if(confForm.valid){
      let data = {
        titulo : confForm.value.titulo,
        serie : confForm.value.serie,
        correlativo : confForm.value.correlativo,
        categorias : this.config.categorias,
        logo : this.file
      }

      console.log(data);
                
      this._adminService.actualizar_config_admin("62ab14f824ba5ef33483e61b",data,this.token).subscribe(
        response=>{
          iziToast.show({
            theme: 'dark',
            backgroundColor: '#9A6EB0',
            titleColor: '#1DC74C',
            title: 'SUCCES',
            class: 'text-succes',
            position: 'topRight',
            message: 'Se actualizó la configuración',
            messageColor: '#000000'
        });     
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
        message: 'Debe completar el formulario de forma correcta',
        messageColor: '#000000'
      });
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
      $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
      $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');

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

  ngDoCheck(): void{
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">")
  }

  eliminar_categoria(idx:any){
    this.config.categorias.splice(idx,1);
  }

}
