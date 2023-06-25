import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  clientes!: Cliente[] | any;
  constructor(private clienteService: ClienteService) {

  }
  ngOnInit(){
   this.clienteService.getClientes().pipe(
    tap(clientes => this.clientes = clientes)
   ).subscribe();
  }
  delete(cliente:Cliente):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe( response => {
          this.clientes = this.clientes.filter((cli: Cliente) => cli !== cliente);
          swalWithBootstrapButtons.fire(
            'Cliente eliminado!',
            `Cliente ${cliente.nombre} eliminado con exito.`,
            'success'
          )
        });
      }
    })
  }
}

