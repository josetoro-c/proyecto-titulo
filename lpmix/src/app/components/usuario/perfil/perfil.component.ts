import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente : any = {};
  public id:any;
  public token:any;

  constructor(
    private _clienteService:ClienteService,
  ) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if(this.id){
      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
            this.cliente = response.data;
        }
      );
    }
   }  

  ngOnInit(): void {
  }

  actualizar(actualizarForm:any){
    if(actualizarForm.valid){
      this.cliente.password = $('#input_password').val();
      this._clienteService.actualizar_perfil_cliente_guest(this.id,this.cliente,this.token).subscribe(
        response=>{
          iziToast.show({
              theme: 'dark',
              backgroundColor: '#9A6EB0',
              titleColor: '#1DC74C',
              title: 'SUCCES',
              class: 'text-succes',
              position: 'topRight',
              message: 'Se actualizó su perfil correctamente  .',
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
        message: 'Los datos del formulario no son validos',
        messageColor: '#000000'
      });
    }
  }

}
