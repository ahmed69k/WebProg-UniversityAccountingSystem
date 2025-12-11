  import { Injectable } from "@angular/core";
  import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
  import { UserService } from "../../shared/userService/userService";

  @Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate{
    constructor(private router: Router, private userService: UserService){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
  return true;
}
    
  }