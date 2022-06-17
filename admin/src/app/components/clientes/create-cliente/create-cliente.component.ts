import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  public cliente : any = {
    genero:''
  };

  public token:any;
  public load_btn = false;

  constructor(
    private _clienteService:ClienteService,
    private _adminService:AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
  }

  registro(registroForm:any){
    if(registroForm.valid){
      console.log(this.cliente);
      this.load_btn = true;
      this._adminService.registro_cliente_admin(this.cliente,this.token).subscribe(
        response=>{
            iziToast.show({
              theme: 'dark',
              backgroundColor: '#9A6EB0',
              titleColor: '#1DC74C',
              title: 'SUCCES',
              class: 'text-succes',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo cliente.',
              messageColor: '#000000'
          });

          this.cliente = {
            genero : '',
            nombre : '',
            apellidos : '',
            f_nacimiento : '',
            telefono : '',
            dni : '',
            email : ' '
          }

          this.load_btn = false;

          this._router.navigate(['/panel/clientes']);

        },
        error=>{
          console.log(error);
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
