import { Injectable } from "@angular/core";
import swal, {SweetAlertIcon} from "sweetalert2"
import { User } from "./userService/userService";
import { FeesService } from "./feesService/feesService";

@Injectable({providedIn: 'root'})
export class ToastService{
    constructor(){}
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
    async feePayment(credit_card: string): Promise<boolean> {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: `Confirm payment to GIU from card **** **** **** ${credit_card}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm payment!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    });

    if (result.isConfirmed) {
        await swalWithBootstrapButtons.fire({
        title: "Fees paid!",
        text: "Your student fees have been paid successfully!",
        icon: "success"
        });
        return true; // <-- CORRECT RETURN
    } else {
        await swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Operation cancelled!",
        icon: "error"
        });
        return false; // <-- ALSO CORRECT
    }
    }
   
}