import { Injectable } from "@angular/core";
import swal, {SweetAlertIcon} from "sweetalert2"

@Injectable({providedIn: 'root'})
export class ToastService{
    success(message:string,icon:SweetAlertIcon='success'){
        swal.fire({
            toast:true,
            position: 'top-end',
            icon,
            title:message,
            showConfirmButton: false,
            timer:3000,
            timerProgressBar: true,
        })
    }
    error(message:string,icon:SweetAlertIcon='error'){
        swal.fire({
            toast:true,
            position: 'top-end',
            icon, 
            title:message,
            showConfirmButton: false, 
            timer:3000,
            timerProgressBar: true,
        })
    }    
}