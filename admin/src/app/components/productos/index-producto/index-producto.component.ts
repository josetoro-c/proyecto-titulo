import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';


declare var iziToast:any;
declare var jQuery:any;
declare var $:any;
declare var tns:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public load_data = true;
  public filtro = '';
  public token:any;
  public productos : Array<any> = [];  
  public arr_productos : Array<any> = [];  
  public url:any;
  public page = 1;
  public pageSize = 4;

  public load_btn =  false;

  constructor(
    private _productoService : ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
    setTimeout(()=>{
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true }
        }
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20
          },
          400: {
            items: 2,
            gutter: 20
          },
          520: {
            gutter: 30
          },
          768: {
            items: 3,
            gutter: 30
          }
        }
        
      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          420: {
            items: 2,
            gutter: 20
          },
          600: {
            items: 3,
            gutter: 20
          },
          700: {
            items: 3,
            gutter: 30
          },
          900: {
            items: 4,
            gutter: 30
          },
          1200: {
            items: 5,
            gutter: 30
          },
          1400: {
            items: 6,
            gutter: 30
          }
        }
        
        
      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        controlsContainer:'#custom-controls-trending',
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
        
      });

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 }
        }
        
      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 }
        }
        
      });

    },500);
  }

  init_data(){
    this._productoService.listar_productos_admin(this.filtro,this.token).subscribe(
      response=>{
        console.log(response);
        this.productos = response.data;
        this.productos.forEach(element =>{
          this.arr_productos.push({
            titulo: element.titulo,
            stock: element.stock,
            precio: element.precio,
            categoria: element.categoria,
            nventas: element.nventas
          });
        });
        console.log(this.arr_productos);
        this.load_data = false;
      },
      error=>{
        console.log(error);
      }
    )
  }


  filtrar(){
    if(this.filtro){
      this._productoService.listar_productos_admin(this.filtro,this.token).subscribe(
        response=>{
          console.log(response);
          this.productos = response.data;
          this.load_data = false;
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
        message: 'Ingrese un filtro para buscar',
        messageColor: '#000000'
    });
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id:any){
    this.load_btn = true;
    this._productoService.eliminar_producto_admin(id,this.token).subscribe(
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
        this.load_btn = false;
      }
    )
  }

  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }
    let fname='REP01-';
    worksheet.columns = [
      {header : 'Producto',key:'col1',width:30},
      {header : 'Stock',key:'col2',width:15},
      {header : 'Precio',key:'col3',width:15},
      {header : 'Categoria',key:'col4',width:25},
      {header : 'N° Ventas',key:'col5',width:15},
    ]as any;

    workbook.xlsx.writeBuffer().then((data)=>{
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob,fname+'-'+new Date().valueOf()+'.xlsx');
    });
  
  }
}
