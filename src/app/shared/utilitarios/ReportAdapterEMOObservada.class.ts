import { ReporteEMOObservada } from "./reporteEMOObservada.model";

export interface iReporte {
    idhistemoxpers?: number, 
    tcodipers?: string,
    tnombpers?: string,
    tplanta?: string,
    tfechinic?: string,
    tcantanua?: number, 
    idaptitudemo?: string,
    tdescemo?: string,
    tstatus?: string,
    tfechalimite?: string
}

export class ReportAdapterEMOObservada {
    data: iReporte[] = [];
    constructor(reportList: ReporteEMOObservada[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                idhistemoxpers: report.idhistemoxpers,
                tcodipers: report.tcodipers,
                tnombpers: report.tnombpers,
                tplanta: report.tplanta,
                tfechinic: report.tfechinic,
                tcantanua: report.tcantanua,
                idaptitudemo: report.idaptitudemo,
                tstatus: report.tstatus,
                tdescemo: report.tdescemo,
                tfechalimite: report.tfechalimite
            }
            this.data.push(reportItem)
        })
    }
}