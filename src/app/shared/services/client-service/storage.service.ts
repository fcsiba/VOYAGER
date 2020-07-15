import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { StorageKeys } from '../../enums/enums';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public user : User= new User();
    constructor(
        
    ){

    }
    GetProperty(key) { 
        var val= window.localStorage.getItem(key);
        if(val!="undefined")
        {
            return JSON.parse(val);
        }
        else
        {
            return val;
        }
    }

    SetProperty(key, value,parse=true) {
        if(parse)
        {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        else
        {
            window.localStorage.setItem(key, value);
        }
        
    }

    RemoveProperty(key) {
        window.localStorage.removeItem(key);
        return true;
    }

    RemoveAllProperties() {
        // this.user = new User();
        window.localStorage.clear();
        return true;
    }

     getUser(){
            this.user=new User();
            if(this.GetProperty(StorageKeys.User)!=null)
            {
                this.user=Object.assign(this.user,this.GetProperty(StorageKeys.User));
            }
        return this.user;
     }

    setUser(user: User){
        if(!this.user)
        {
            this.user = new User();
        }
        this.user=Object.assign(this.user,user);
        this.SetProperty(StorageKeys.User,this.user);
     }

     isAuthenticated() {
        let IsloggedIn = this.user.id ? true : false;
        return IsloggedIn;
    }

}