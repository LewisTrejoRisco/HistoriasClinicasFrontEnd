import { ReporteAccidente } from "./reporteAccidente.model";

export interface iReporte {
    idaccilabo?: number, 
    tfechacci?: string,
    tcodipers?: string,
    tdiagnostico?: string,
    tclasificacion?: string,
    treferencia?: number,
    tdescansomedico?: number,
    trestriccionlaboral?: string,
    tindicacionespecial?: string,
    tobservaciones?: string,
    tnombunidfuncorig?: string
}

export class ReportAdapterAccidente {
    data: iReporte[] = [];
    constructor(reportList: ReporteAccidente[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                idaccilabo: report.idaccilabo,
                tfechacci: report.tfechacci,
                tcodipers: report.tcodipers,
                tdiagnostico: report.tdiagnostico,
                tclasificacion: report.tclasificacion,
                treferencia: report.treferencia,
                tdescansomedico: report.tdescansomedico,
                trestriccionlaboral: report.trestriccionlaboral,
                tindicacionespecial: report.tindicacionespecial,
                tobservaciones: report.tobservaciones,
                tnombunidfuncorig: report.tnombunidfuncorig
            }
            this.data.push(reportItem)
        })
    }
}