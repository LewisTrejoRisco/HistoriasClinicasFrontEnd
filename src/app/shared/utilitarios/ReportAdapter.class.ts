import { Reporte } from "./reporte.model";

export interface iReporte {
    idhistemoxpers?: number, 
    tcodipers?: string,
    tnombpers?: string,
    tplanta?: string,
    tfechinic?: string,
    idaptitudemo?: string,
    tcantanua?: number,
    contador?: number,
    tfechvenc?: string
}

export class ReportAdapter {
    data: iReporte[] = [];
    constructor(reportList: Reporte[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                idhistemoxpers: report.idhistemoxpers,
                tcodipers: report.tcodipers,
                tnombpers: report.tnombpers,
                tplanta: report.tplanta,
                tfechinic: report.tfechinic,
                idaptitudemo: report.idaptitudemo,
                tcantanua: report.tcantanua,
                contador: report.contador,
                tfechvenc: report.tfechvenc
            }
            this.data.push(reportItem)
        })
    }
}