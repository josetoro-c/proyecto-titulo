import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public token;

  public cupon :any = {
    tipo: ''
  };
  public load_btn = false;

  constructor(
    private _cuponService : CuponService,
    private _router: Router
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  registro(registroForm:any){
    if(registroForm.valid){
      this.load_btn = true;
      this._cuponService.registro_cupon_admin(this.cupon,this.token).subscribe(
        response=>{
          iziToast.show({
            theme: 'dark',
            backgroundColor: '#9A6EB0',
            titleColor: '#1DC74C',
            title: 'SUCCES',
            class: 'text-succes',
            position: 'topRight',
            message: 'Se registró correctamente el nuevo cupón.',
            messageColor: '#000000'
          });

          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);

        },
        error=>{
          console.log(error);
          this.load_btn = false;
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

}
