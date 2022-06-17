import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes : Array<any>=[];
  public filtro_apellidos = '';
  public filtro_correo = '';

  public page = 4;
  public pageSize = 4;
  public token;
  public load_data = true;

  constructor(
    private _clienteService : ClienteService,
    private _adminService : AdminService
  ) { 
    this.token = this._adminService.getToken(); 
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._adminService.listar_clientes_filtro_admin(null,null,this.token).subscribe(              //Listamos los clientes
      response=>{

        this.clientes = response.data;
        this.load_data = false;

      },
      error=>{
        console.log(error);
      }
    );
  }


  filtro(tipo:any){
    if( tipo == 'apellidos'){
      if(this.filtro_apellidos){      // si filtro_apellidos se encuentra con datos, buscara por el fitro
        this.load_data = true;
        this._adminService.listar_clientes_filtro_admin(tipo,this.filtro_apellidos,this.token).subscribe(              //Listamos los apellidos
      response=>{
          this.clientes = response.data;
          this.load_data = false;
      },
      error=>{
          console.log(error); 
        }
      ); 
      }else{
        this.init_Data();
      }
    }else if( tipo == 'correo'){
      if(this.filtro_correo){      
        this.load_data = true;
        this._adminService.listar_clientes_filtro_admin(tipo,this.filtro_correo,this.token).subscribe(              //Listamos los correos
      response=>{
          this.clientes = response.data;
          this.load_data = false;
      },
      error=>{
          console.log(error); 
        
        }
      ); 
      }else{
        this.init_Data();
      }
    }
  }

  eliminar(id:any){
    this._adminService.eliminar_cliente_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          theme: 'dark',
          backgroundColor: '#9A6EB0',
          titleColor: '#1DC74C',
          title: 'SUCCES',
          class: 'text-succes',
          position: 'topRight',
          message: 'Cliente eliminado con exito.',
          messageColor: '#000000'
      });

      $('#delete-'+id).modal('hide');
      $('.modal-backdrop').removeClass('show');
      
      this.init_Data();

      },
      error=>{
        console.log(error);
      }
    )
  }


}
