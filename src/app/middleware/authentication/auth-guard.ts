  import { Injectable } from "@angular/core";
  import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
  import { UserService } from "../../shared/userService/userService";

  @Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate{
    constructor(private router: Router, private userService: UserService){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token')
    if(!token){
      return this.router.createUrlTree(['/login'])
    }
    const currentUser = this.userService.users.find(u=> u.token === token)
    if(!currentUser){
      return this.router.createUrlTree(['/login'])
    }
    const allowedRoles = route.data['roles'] as string[];
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return this.router.createUrlTree(['/notfound']);
    }
    return true;
}
    
  }