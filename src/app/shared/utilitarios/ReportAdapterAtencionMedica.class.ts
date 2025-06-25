import { ReporteAtencionMedica } from "./reporteAtencionMedica.model";

export interface iReporte {
    tfechatenmedi?: string, 
    tnumedocuiden?: string,
    tcodipers?: string,
    tedad?: string,
    tapelpate?: string,
    tapelmate?: string,
    tnombpila?: string,
    tdescunidfunc?: string,
    tdiagnostico?: string
}

export class ReportAdapterAtencionMedica {
    data: iReporte[] = [];
    constructor(reportList: ReporteAtencionMedica[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                tfechatenmedi: report.tfechatenmedi,
                tnumedocuiden: report.tnumedocuiden,
                tcodipers: report.tcodipers,
                tedad: report.tedad,
                tapelpate: report.tapelpate,
                tapelmate: report.tapelmate,
                tnombpila: report.tnombpila,
                tdescunidfunc: report.tdescunidfunc,
                tdiagnostico: report.tdiagnostico
            }
            this.data.push(reportItem)
        })
    }
}