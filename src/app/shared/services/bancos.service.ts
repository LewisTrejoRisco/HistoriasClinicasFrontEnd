import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CUENTA_ORDENANTE, DIVISA_CUENTA_SOLES, DOCUMENTO_RUC_ORDENANTE, INDICADOR_DEVOLUCION, NOMBRE_ORDENANTE, PRIMER_ORDENANTE, SEGUNDO_ORDENANTE, SERVICIO_QUINTA_CATEGORIA, SOLICITUDXUSUARIO, TIPO_DOCUMENTO_RUC, URL_END_POINT_BASE, VALIDACION_PERTENENCIA_VALIDA } from "app/shared/utilitarios/Constantes";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class BancosService {
    constructor() {

    }

    // public primerRegistro(): string {
    //     const linea = PRIMER_ORDENANTE + 
    //                   TIPO_DOCUMENTO_RUC + 
    //                   this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) + 
    //                   "17012024" + 
    //                   "17012024" + 
    //                   CUENTA_ORDENANTE + 
    //                   DIVISA_CUENTA_SOLES + 
    //                   LIBRE_PRIMERA_FILA + 
    //                   VALIDACION_PERTENENCIA_VALIDA + 
    //                   INDICADOR_DEVOLUCION + 
    //                   "HABERE_LIQUIDACIONEN" + 
    //                   SERVICIO_QUINTA_CATEGORIA + 
    //                   LIBRE_PRIMERA_FILA_162;
    //     return linea;
    // }

    // public segundoRegistro(): string {
    //     const linea = SEGUNDO_ORDENANTE + 
    //                   TIPO_DOCUMENTO_RUC + 
    //                   DOCUMENTO_RUC_ORDENANTE + 
    //                   this.PadLeft(NOMBRE_ORDENANTE, 35) + 
    //                   this.PadLeft(" ", 35) + 
    //                   this.PadLeft(" ", 168)
    //     return linea;
    // }

     PadLeft(value: string, length: number) {
        return (value.toString().length < length) ? this.PadLeft(value+ " ", length) : value;
    }

}