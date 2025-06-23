import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AUTENTICAR, FINDBYTCODIPERS, LISTARXCODIGO, OBTENERFOTO, OBTENERTOKEN, URL_END_POINT_BASE, URL_END_POINT_BASE_2, URL_END_POINT_BASE_COMMON } from 'app/shared/utilitarios/Constantes';
import { catchError } from "rxjs/operators";

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private sesion: string;
  private token: string;
  private usuarioSolicitar: string;

  constructor(public _firebaseAuth: AngularFireAuth, public router: Router, private http: HttpClient) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
      }
    );

  }

  signupUser(user: string) {
    //your code for signing up the new user
    // return this.http.get<any>('assets/json/loginResponse.json');
     return this.obtenerDatos(user.toUpperCase());
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user
    //console.log(this._firebaseAuth.signInWithEmailAndPassword(email, password))
    return this._firebaseAuth.signInWithEmailAndPassword(email, password)

  }

  logout() {
    this._firebaseAuth.signOut();
    this.router.navigate(['YOUR_LOGOUT_URL']);
  }

  isAuthenticated() {
    return true;
  }
  
  public guardarSesion(sesion: string): void {
      this.sesion = sesion;
      sessionStorage.setItem('sesion', this.sesion);
  }
  
  public guardarToken(token: string): void {
      this.token = token;
      sessionStorage.setItem('token', this.token);
  }
  
  public guardarUsuarioExpediente(usuarioSolicitar: string): void {
      this.usuarioSolicitar = usuarioSolicitar;
      sessionStorage.setItem('usuarioSolicitar', this.usuarioSolicitar);
  }

  public get userSesion(): string {
      if (this.sesion != null) {
          return this.sesion;
      } else if (this.sesion == null && sessionStorage.getItem('sesion') != null) {
          this.sesion = sessionStorage.getItem('sesion');
          return this.sesion;
      }
      return null;
  }

  public get userToken(): string {
      if (this.token != null) {
          return this.token;
      } else if (this.token == null && sessionStorage.getItem('token') != null) {
          this.token = sessionStorage.getItem('token');
          return this.token;
      }
      return null;
  }

  public get userUsuarioExpediente(): string {
      if (this.usuarioSolicitar != null) {
          return this.usuarioSolicitar;
      } else if (this.usuarioSolicitar == null && sessionStorage.getItem('usuarioSolicitar') != null) {
          this.usuarioSolicitar = sessionStorage.getItem('usuarioSolicitar');
          return this.usuarioSolicitar;
      }
      return null;
  }

  public cerrarSesion(): void {
      this.sesion = null;
      this.token = null;
      this.usuarioSolicitar = null;
      sessionStorage.clear();
  }

  public obtenerToken() {
    let objCredenciales = {
      parametro: 'KEY_SIST_VACA',
      valor: 'Nettalco$2024'
    }
    //console.log(OBTENERTOKEN + objCredenciales)
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    return this.http.post(OBTENERTOKEN, objCredenciales, { headers })
        .pipe(catchError(e => {
            console.error(' Error al intentar rechazar solicitud. Msg: ' + e.error);
            return throwError(e);
        })
    );
  }

  public autenticarUsuario(user: string, password: string, token: string) {
    let objCredenciales = {
      p_codipers: user.toUpperCase(),
      p_clavpers: password
    }
    //console.log(AUTENTICAR + objCredenciales)
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
    });
    return this.http.post(AUTENTICAR, objCredenciales, { headers })
        .pipe(catchError(e => {
            console.error(' Error al intentar rechazar solicitud. Msg: ' + e.error);
            return throwError(e);
        })
    );
  }

  public obtenerDatos(codiUsua: string) {
    //console.log(URL_END_POINT_BASE + OBTENERDATOS + codiUsua)
        return this.http.get(URL_END_POINT_BASE_COMMON + FINDBYTCODIPERS + "?tcodipers=" + codiUsua)
        .pipe(catchError(e => {
            console.error(' Error al intentar listar. Msg: ' + e.error);
            return throwError(e);
        })
    );
  }

  public obtenerFoto(codiUsua: string, token: string ) {
    console.log(codiUsua + " - " +token)
    // console.log(token)
    const headers = new HttpHeaders({
        'Authorization': token
    });
    //console.log(headers)
        return this.http.get(OBTENERFOTO + codiUsua, { 
          headers: headers,
          responseType: 'blob'
        })
        .pipe(catchError(e => {
            console.error(' Error al intentar mostrar foto. Msg: ' + e.error);
            return throwError(e);
        })
    );
  }
}
