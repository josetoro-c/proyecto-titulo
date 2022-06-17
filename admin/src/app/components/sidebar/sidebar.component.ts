import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public token:any;
  public id:any;
  public user:any = undefined;
  public user_lc : any = undefined;
  public url:any;
  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _http : HttpClient
  ) { 
    
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.token = localStorage.getItem('_id');


    // if(this.token){
    //   this._adminService.obtener_cliente_admin(this.id,this.token).subscribe(
    //     response=>{
    //       this.user = response.data;
    //       localStorage.setItem('user_data',JSON.stringify(this.user));
    //       if(localStorage.getItem('user_data')){
    //         this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
    //       }else{
    //         this.user_lc = undefined;
    //       }
    
    //     },
    //     error=>{
    //       console.log(error);
    //       this.user = undefined;
    //     }
    //   );
    // }

  }

  ngOnInit(): void {
  }

}


