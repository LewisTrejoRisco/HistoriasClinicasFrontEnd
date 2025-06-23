import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DELETE_ACCILABO, DELETE_AOXPER, DELETE_APTITUDEMO_AOXPER, DELETE_APXPER, DELETE_VACUNA, DELETE_VACUNAXPERS, FINDBYIDHISTEMOPERS, INSERT_ACCILABO, INSERT_AOXPER, INSERT_AP, INSERT_APTITUDEMO_AOXPER, INSERT_APXPER, INSERT_ESPECIALIDAD_AO, INSERT_RESTRICCION_AO, INSERT_VACUNA, INSERT_VACUNAXPERS, LIKE_ANTEPATO, LISTARXCODIGO, LISTARXNOMBRE, LISTAR_ACCIDENTESLABORALES_PERSONA, LISTAR_ALERGIA_PERSONA, LISTAR_ANTEPATOXPER, LISTAR_APTITUDEMO_AO, LISTAR_EMOXPERSONA_AO, LISTAR_EMOXPERSONA_FIRS_LAST, LISTAR_ESPECIALIDAD_AO, LISTAR_RESTRICCION_AO, LISTAR_VACUNA, LISTAR_VACUNAXPERS, OBTENERFOTO, UPDATE_ACCILABO, UPDATE_AOXPER, UPDATE_APTITUDEMO_AOXPER, UPDATE_APXPER, UPDATE_VACUNA, UPDATE_VACUNAXPERS, URL_END_POINT_BASE_2, URL_END_POINT_BASE_COMMON } from "app/shared/utilitarios/Constantes";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { PDFDocument, rgb } from 'pdf-lib';
import { Reporte } from "../utilitarios/reporte.model";
import { ReporteEMOObservada } from "../utilitarios/reporteEMOObservada.model";
import * as ExcelJS from 'exceljs';
import { ReporteAccidente } from "../utilitarios/reporteAccidente.model";

@Injectable()
export class SolicitarService {
    constructor(private http: HttpClient) {

    }
    
    // Función para crear un PDF
    
    async createPDF(userData: any) {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([550, 750])
          // Cargar la imagen
        const imgUrl = 'assets/img/nettalco.jpg'; // URL de la imagen
        const imgBytes = await fetch(imgUrl).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedJpg(imgBytes);
          // Dibujar la imagen en la página
        const width = 100; // Anchura de la imagen en puntos
        const height = 50; // Altura de la imagen en puntos
        const x = 30; // Posición X de la imagen en la página
        const y = 670; // Posición Y de la imagen en la página
        page.drawImage(image, {
            x,
            y,
            width,
            height,
        });

        const form = pdfDoc.getForm()

        page.drawText('BOLETA DE PERMISO', { x: 180, y: 670, size: 18 })
        page.drawText('Revisión:  001', { x: 420, y: 720, size: 12 })
        page.drawText('Página:    1 DE 1', { x: 420, y: 700, size: 12 })
        page.drawText('Código:    FSF-002', { x: 420, y: 680, size: 12 })

        page.drawText('Fecha: ', { x: 50, y: 550, size: 15 })
        page.drawText('---------------------------------', { x: 100, y: 540, size: 15 })
        page.drawText(userData.fechaActual, { x: 120, y: 550, size: 13 })
        page.drawText('Código: ', { x: 275, y: 550, size: 15 })
        page.drawText('-------------------------------', { x: 330, y: 540, size: 15 })
        page.drawText(userData.codigo, { x: 350, y: 550, size: 13 })
        page.drawText('Nombre: ', { x: 50, y: 500, size: 15 })
        page.drawText('---------------------------------------------------------------------------', { x: 113, y: 490, size: 15 })
        page.drawText(userData.nombre, { x: 133, y: 500, size: 13 })
        page.drawText('Hora Inicio: ', { x: 50, y: 450, size: 15 })
        page.drawText('---------------------------', { x: 130, y: 440, size: 15 })
        page.drawText(userData.horaInicio, { x: 150, y: 450, size: 13 })
        page.drawText('Hora Fin: ', { x: 275, y: 450, size: 15 })
        page.drawText('-----------------------------', { x: 340, y: 440, size: 15 })
        page.drawText(userData.horaFin, { x: 360, y: 450, size: 13 })
        page.drawText('Motivo: ', { x: 50, y: 400, size: 15 })
        page.drawText('---------------------------------------------------------------------------', { x: 113, y: 390, size: 15 })
        page.drawText('-----------------------------------------------------------------------------------------', { x: 50, y: 340, size: 15 })
        page.drawText(userData.nombreAprob, { x: 180, y: 240, size: 15 })
        page.drawText('-------------------------------------------------', { x: 160, y: 230, size: 15 })
        page.drawText('Jefe de Sector ' + userData.codigoAprob, { x: 180, y: 210, size: 15 })
        page.drawText('Fecha aprobación: ', { x: 20, y: 30, size: 10 })
        page.drawText('04/08/2023', { x: 110, y: 30, size: 10 })


        const pdfBytes = await pdfDoc.save()

        // Crear un blob a partir de los bytes del PDF
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Descargar el archivo PDF
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'permiso_'+userData.codigo+'.pdf';
        link.click();
    }

    generateReportWithAdapter(headers: string[], data: ReporteEMOObservada[], filename: string) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Hoja 1");
  
      // Crear un mapeo entre las cabeceras y las propiedades de los datos
      const headerToPropertyMap = {
        'ID':'idhistemoxpers', 
        'Codigo colaborador':'tcodipers', 
        'Nombre Colaborador':'tnombpers', 
        'Ubicación':'tplanta',  
        'Fecha inicio':'tfechinic',  
        'Cantidad':'tcantanua',
        'Aptitud':'idaptitudemo',  
        'Status':'tstatus',  
        'Detalle':'tdescemo',  
        'Fecha Limite':'tfechalimite'
    }
  
      // Definir las columnas de la hoja de trabajo
      worksheet.columns = headers.map(header => ({
          header: header,
          key: header,
          width: 20
      }));

      const firstRowHeight = 40; // Altura de la primera fila para la imagen y el título
      worksheet.mergeCells('B1:I1'); // Fusionamos las celdas B1 hasta H1 para el título
      worksheet.getCell('B1').value = 'REGISTRO DE ATENCIONES MÉDICAS DIARIAS'; 
      worksheet.getCell('B1').style = {
          font: { bold: true, size: 16 },
          alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
      };
      // worksheet.mergeCells('B1:H1'); // Fusionamos las celdas B1 hasta H1 para el título
      worksheet.getCell('J1').value = 'REVISIÓN 001\nPÁGINA 01 DE 01\nCÓDIGO FSO-004'; 
      worksheet.getCell('J1').style = {
          font: { bold: true, size: 12 },
          alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
      };

      // Agregar la imagen en la celda A1
      if (data.length > 0 ) {  // Suponiendo que row.evidenciauno tiene la imagen base64
          const imageBase64 = "data:image/jpeg;base64,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";
          const extension = this.getImageExtension(imageBase64); // Asumiendo que tienes esta función
  
          const imageId = workbook.addImage({
              base64: imageBase64,
              extension: extension,
          });
          // Obtener las dimensiones de la celda A1:B1
          const columnWidth = worksheet.getColumn(1).width;  // Ancho de la columna A
          const rowHeight = worksheet.getRow(1).height;      // Altura de la fila 1
  
          worksheet.addImage(imageId, {
              tl: { col: 0, row: 0 }, // Columna A, fila 1 (para la imagen)
              ext: { width: 140, height: 50 } // Ajuste de tamaño de la imagen
          });
      }
  
      worksheet.getRow(1).height = firstRowHeight; 

      // Las cabeceras empiezan en la fila 2
      worksheet.addRow(headers);
      worksheet.getRow(2).font = { bold: true }; // Hacer las cabeceras negritas
  
      // Agregar los datos de las filas a la hoja de trabajo
      data.forEach((row, rowIndex) => {
          const rowData = headers.map(header => row[headerToPropertyMap[header]]);
          worksheet.addRow(rowData);
      });
  
      // Generar el archivo y permitir la descarga en el navegador
      workbook.xlsx.writeBuffer()
          .then((buffer) => {
              const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              link.click();
          })
          .catch((err) => {
              console.error('Error al generar el archivo Excel:', err);
          });
    }

    generateReportWithAdapter2(headers: string[], data: Reporte[], filename: string) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Hoja 1");
    
        // Crear un mapeo entre las cabeceras y las propiedades de los datos
        const headerToPropertyMap = {
            'ID':'idhistemoxpers', 
            'Codigo colaborador':'tcodipers', 
            'Nombre Colaborador':'tnombpers', 
            'Ubicación':'tplanta',  
            'Fecha inicio':'tfechinic',  
            'Aptitud':'idaptitudemo',  
            'Cantida programado anual':'tcantanua',  
            '# Veces tomada anual':'contador',  
            'Fecha vencimiento':'tfechvenc'
        };
    
        // Definir las columnas de la hoja de trabajo
        worksheet.columns = headers.map(header => ({
            header: header,
            key: header,
            width: 20
        }));

        const firstRowHeight = 40; // Altura de la primera fila para la imagen y el título
        worksheet.mergeCells('B1:H1'); // Fusionamos las celdas B1 hasta H1 para el título
        worksheet.getCell('B1').value = 'REGISTRO DE ENTREGA DE RESULTADO'; 
        worksheet.getCell('B1').style = {
            font: { bold: true, size: 16 },
            alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
        };
        // worksheet.mergeCells('B1:H1'); // Fusionamos las celdas B1 hasta H1 para el título
        worksheet.getCell('I1').value = 'REVISIÓN 001\nPÁGINA 01 DE 01\nCÓDIGO FSO-002'; 
        worksheet.getCell('I1').style = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
        };

        // Agregar la imagen en la celda A1
        if (data.length > 0 ) {  // Suponiendo que row.evidenciauno tiene la imagen base64
            const imageBase64 = "data:image/jpeg;base64,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";
            const extension = this.getImageExtension(imageBase64); // Asumiendo que tienes esta función
    
            const imageId = workbook.addImage({
                base64: imageBase64,
                extension: extension,
            });
            // Obtener las dimensiones de la celda A1:B1
            const columnWidth = worksheet.getColumn(1).width;  // Ancho de la columna A
            const rowHeight = worksheet.getRow(1).height;      // Altura de la fila 1
    
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 }, // Columna A, fila 1 (para la imagen)
                ext: { width: 140, height: 50 } // Ajuste de tamaño de la imagen
            });
        }
    
        worksheet.getRow(1).height = firstRowHeight; 

        // Las cabeceras empiezan en la fila 2
        worksheet.addRow(headers);
        worksheet.getRow(2).font = { bold: true }; // Hacer las cabeceras negritas
    
        // Agregar los datos de las filas a la hoja de trabajo
        data.forEach((row, rowIndex) => {
            const rowData = headers.map(header => row[headerToPropertyMap[header]]);
            worksheet.addRow(rowData);
        });
    
        // Generar el archivo y permitir la descarga en el navegador
        workbook.xlsx.writeBuffer()
            .then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            })
            .catch((err) => {
                console.error('Error al generar el archivo Excel:', err);
            });
    }

    generateReporMovitWithAdapter(headers: string[], data: ReporteAccidente[], filename: string) {
    //   let workbook = XLSX.utils.book_new();
    //   let worksheet = XLSX.utils.json_to_sheet([], { header: headers });
    
    //   XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true })
    
    //   XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1")
    //   XLSX.writeFileXLSX(workbook, filename);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Hoja 1");
  
      // Crear un mapeo entre las cabeceras y las propiedades de los datos
      const headerToPropertyMap = {
        'ID':'idaccilabo', 
        'Fecha Accidente':'tfechacci', 
        'Codigo Persona':'tcodipers', 
        'Diagnostico':'tdiagnostico',  
        'Clasificación':'tclasificacion',  
        'Descanso Médico':'tdescansomedico',
        'Restricción':'trestriccionlaboral',  
        'Indicaciones':'tindicacionespecial',  
        'Observaciones':'tobservaciones',  
        'Unidad Funcional':'tnombunidfuncorig'
    }
  
      // Definir las columnas de la hoja de trabajo
      worksheet.columns = headers.map(header => ({
          header: header,
          key: header,
          width: 20
      }));

      const firstRowHeight = 40; // Altura de la primera fila para la imagen y el título
      worksheet.mergeCells('B1:I1'); // Fusionamos las celdas B1 hasta H1 para el título
      worksheet.getCell('B1').value = 'REGISTRO DE ATENCIÓN EN ACCIDENTES DE TRABAJO'; 
      worksheet.getCell('B1').style = {
          font: { bold: true, size: 16 },
          alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
      };
      // worksheet.mergeCells('B1:H1'); // Fusionamos las celdas B1 hasta H1 para el título
      worksheet.getCell('J1').value = 'REVISIÓN 001\nPÁGINA 01 DE 01\nCÓDIGO FSO-003'; 
      worksheet.getCell('J1').style = {
          font: { bold: true, size: 12 },
          alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
      };

      // Agregar la imagen en la celda A1
      if (data.length > 0 ) {  // Suponiendo que row.evidenciauno tiene la imagen base64
          const imageBase64 = "data:image/jpeg;base64,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";
          const extension = this.getImageExtension(imageBase64); // Asumiendo que tienes esta función
  
          const imageId = workbook.addImage({
              base64: imageBase64,
              extension: extension,
          });
          // Obtener las dimensiones de la celda A1:B1
          const columnWidth = worksheet.getColumn(1).width;  // Ancho de la columna A
          const rowHeight = worksheet.getRow(1).height;      // Altura de la fila 1
  
          worksheet.addImage(imageId, {
              tl: { col: 0, row: 0 }, // Columna A, fila 1 (para la imagen)
              ext: { width: 140, height: 50 } // Ajuste de tamaño de la imagen
          });
      }
  
      worksheet.getRow(1).height = firstRowHeight; 

      // Las cabeceras empiezan en la fila 2
      worksheet.addRow(headers);
      worksheet.getRow(2).font = { bold: true }; // Hacer las cabeceras negritas
  
      // Agregar los datos de las filas a la hoja de trabajo
      data.forEach((row, rowIndex) => {
          const rowData = headers.map(header => row[headerToPropertyMap[header]]);
          worksheet.addRow(rowData);
      });
  
      // Generar el archivo y permitir la descarga en el navegador
      workbook.xlsx.writeBuffer()
          .then((buffer) => {
              const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              link.click();
          })
          .catch((err) => {
              console.error('Error al generar el archivo Excel:', err);
          });
    }
    
    getImageExtension(base64String: string): "jpeg" | "png" | "gif" {
        const mimeType = base64String.split(';')[0].split(':')[1]; // 'image/png' o 'image/jpeg'
        
        const mimeToExtMap: { [key: string]: "jpeg" | "png" | "gif" } = {
          'image/png': 'png',
          'image/jpeg': 'jpeg',
          'image/gif': 'gif',
        };
      
        // Si no se encuentra una extensión válida, lanzamos un error o retornamos un valor predeterminado.
        if (mimeToExtMap[mimeType]) {
          return mimeToExtMap[mimeType]; // Retorna 'jpeg', 'png', 'gif'
        } else {
          throw new Error(`Unsupported MIME type: ${mimeType}`);
          // O bien retornar un valor predeterminado si quieres continuar sin error:
          // return 'png'; // valor predeterminado
        }
      }
  



    



    // INFORMACIÓN PERSONAL
    public listXColaborador(tcodipers: string): Observable<any> {
        console.log(URL_END_POINT_BASE_COMMON + LISTARXCODIGO + "?tcodipers=" + tcodipers)
            return this.http.get(URL_END_POINT_BASE_COMMON + LISTARXCODIGO + "?tcodipers=" + tcodipers)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar colaborador, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listColaByTnomb(tnombcomp: string): Observable<any> {
        console.log(URL_END_POINT_BASE_COMMON + LISTARXNOMBRE + "?tnombcola=" + tnombcomp)
            return this.http.get(URL_END_POINT_BASE_COMMON + LISTARXNOMBRE + "?tnombcola=" + tnombcomp)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar colaborador, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listEmoXPers(tcodipers: string, param: string): Observable<any> {
        console.log(URL_END_POINT_BASE_2 + LISTAR_EMOXPERSONA_FIRS_LAST + "?tcodipers=" + tcodipers + "&param=" + param)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_EMOXPERSONA_FIRS_LAST + "?tcodipers=" + tcodipers + "&param=" + param)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar EMO ingreso Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listAlerXPers(tcodipers: string, tstatus: number): Observable<any> {
        console.log(URL_END_POINT_BASE_2 + LISTAR_ALERGIA_PERSONA + "?tcodipers=" + tcodipers + "&tstatus=" + tstatus)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_ALERGIA_PERSONA + "?tcodipers=" + tcodipers + "&tstatus=" + tstatus)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar EMO ingreso Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // ANTECEDENTES PATOLOGICOS
    public listarAntePatoXPers(tcodipers: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_ANTEPATOXPER + "?tcodipers=" + tcodipers)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_ANTEPATOXPER + "?tcodipers=" + tcodipers)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar ante. pato. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public likeAntePatoXPers(tdescantepato: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LIKE_ANTEPATO + "?tdescantepato=" + tdescantepato)
            return this.http.get(URL_END_POINT_BASE_2 + LIKE_ANTEPATO + "?tdescantepato=" + tdescantepato)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar ante. pato. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreAntePato(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_AP + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_AP, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar AP. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreAntePatoXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_APXPER + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_APXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar AP x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actuAntePatoXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + UPDATE_APXPER + insert)
        return this.http.put(URL_END_POINT_BASE_2 + UPDATE_APXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualiza AP x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public borrAntePatoXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + DELETE_APXPER + insert)
        const options = {
            params: insert, // assuming insert is an object of key-value pairs for params
            headers: { 'Content-Type': 'application/json' }
          };
        return this.http.delete(URL_END_POINT_BASE_2 + DELETE_APXPER, options)
            .pipe(catchError(e => {
                console.error(' Error al intentar borrar AP x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // ANTECEDENTES OCUPACIONALES
    public listEMOXPersAnteOcup(tcodipers: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_EMOXPERSONA_AO + "?tcodipers=" + tcodipers)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_EMOXPERSONA_AO + "?tcodipers=" + tcodipers)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar ante. ocu. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public findByIdHistEmoXPers(idhistemoxpers: number, tstatus: number): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + FINDBYIDHISTEMOPERS + "?idhistemoxpers=" + idhistemoxpers +"&tstatus=" + tstatus)
            return this.http.get(URL_END_POINT_BASE_2 + FINDBYIDHISTEMOPERS + "?idhistemoxpers=" + idhistemoxpers +"&tstatus=" + tstatus)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar ante. ocu. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreAnteOcupXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_AOXPER + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_AOXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar AP x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actuAnteOcupXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + UPDATE_AOXPER + insert)
        return this.http.put(URL_END_POINT_BASE_2 + UPDATE_AOXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar AP x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public borrAnteOcupXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + DELETE_AOXPER + insert)
        return this.http.delete(URL_END_POINT_BASE_2 + DELETE_AOXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar AP x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listAptitudEMO(): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_APTITUDEMO_AO)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_APTITUDEMO_AO)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar aptitud emo Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listEspecialidad(tnombespe: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_ESPECIALIDAD_AO + "?tnombespe=" + tnombespe)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_ESPECIALIDAD_AO + "?tnombespe=" + tnombespe)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar especialidad emo Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreEspecialidad(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_ESPECIALIDAD_AO + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_ESPECIALIDAD_AO, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar AP. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listRestriccion(idespecialidad: number, tnombrest: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_RESTRICCION_AO + "?idespecialidad=" + idespecialidad + "&tnombrest=" + tnombrest)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_RESTRICCION_AO + "?idespecialidad=" + idespecialidad + "&tnombrest=" + tnombrest)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar especialidad emo Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreRestriccion(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_RESTRICCION_AO + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_RESTRICCION_AO, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar restriccion. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // APTITUD

    public agreAnteOcupAptiXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_APTITUDEMO_AOXPER + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_APTITUDEMO_AOXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar apti x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actuAnteOcupAptiXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + UPDATE_APTITUDEMO_AOXPER + insert)
        return this.http.put(URL_END_POINT_BASE_2 + UPDATE_APTITUDEMO_AOXPER, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar apti x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public borrAnteOcupAptiXPers(insert: any) {
        const options = {
            params: insert, // assuming insert is an object of key-value pairs for params
            headers: { 'Content-Type': 'application/json' }
          };
        console.log(URL_END_POINT_BASE_2 + DELETE_APTITUDEMO_AOXPER + insert)
        return this.http.delete(URL_END_POINT_BASE_2 + DELETE_APTITUDEMO_AOXPER, options)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar apti x Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // ACCIDENTES LABORALES
    public listAccidentesLaborales(tcodipers: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_ACCIDENTESLABORALES_PERSONA + "?tcodipers=" + tcodipers)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_ACCIDENTESLABORALES_PERSONA + "?tcodipers=" + tcodipers)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar accidentes laborales Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreAcciLaboXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_ACCILABO + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_ACCILABO, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar aacidente laboral Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actuAcciLaboXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + UPDATE_ACCILABO + insert)
        return this.http.put(URL_END_POINT_BASE_2 + UPDATE_ACCILABO, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualizar aacidente laboral Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public borrAcciLaboXPers(insert: any) {
        const options = {
            params: insert, // assuming insert is an object of key-value pairs for params
            headers: { 'Content-Type': 'application/json' }
          };
        console.log(URL_END_POINT_BASE_2 + DELETE_ACCILABO + options)
        return this.http.delete(URL_END_POINT_BASE_2 + DELETE_ACCILABO, options)
            .pipe(catchError(e => {
                console.error(' Error al intentar borrar aacidente laboral Pers. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // VACUNAS X PERSONA
    public listVacunasXPers(tcodipers: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_VACUNAXPERS + "?tcodipers=" + tcodipers)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_VACUNAXPERS + "?tcodipers=" + tcodipers)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar vacuna por persona Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreVacunasXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_VACUNAXPERS + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_VACUNAXPERS, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar vacuna por persona Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actuVacunasXPers(insert: any) {
        console.log(URL_END_POINT_BASE_2 + UPDATE_VACUNAXPERS + insert)
        return this.http.put(URL_END_POINT_BASE_2 + UPDATE_VACUNAXPERS, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualizar vacuna por persona Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public borrVacunasXPers(insert: any) {
        const options = {
            params: insert, // assuming insert is an object of key-value pairs for params
            headers: { 'Content-Type': 'application/json' }
          };
        console.log(URL_END_POINT_BASE_2 + DELETE_VACUNAXPERS + options)
        return this.http.delete(URL_END_POINT_BASE_2 + DELETE_VACUNAXPERS, options)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualizar vacuna por persona Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // VACUNAS
    public listVacuna(tdescvacu: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + LISTAR_VACUNA + "?tdescvacu=" + tdescvacu)
            return this.http.get(URL_END_POINT_BASE_2 + LISTAR_VACUNA + "?tdescvacu=" + tdescvacu)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar vacunas Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agreVacunas(insert: any) {
        console.log(URL_END_POINT_BASE_2 + INSERT_VACUNA + insert)
        return this.http.post(URL_END_POINT_BASE_2 + INSERT_VACUNA, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar vacuna Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actuVacunas(insert: any) {
        console.log(URL_END_POINT_BASE_2 + UPDATE_VACUNA + insert)
        return this.http.put(URL_END_POINT_BASE_2 + UPDATE_VACUNA, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualizar vacuna Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public borrVacunas(insert: any) {
        console.log(URL_END_POINT_BASE_2 + DELETE_VACUNA + insert)
        return this.http.delete(URL_END_POINT_BASE_2 + DELETE_VACUNA, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualizar vacuna Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    // ATENCION MEDICA COMUN
    public listarfindall(path: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + path)
            return this.http.get(URL_END_POINT_BASE_2 + path)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }
    public listar(path: string, param: string): Observable<any>  {
        console.log(URL_END_POINT_BASE_2 + path + param)
            return this.http.get(URL_END_POINT_BASE_2 + path + param)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public agregar(path: string, insert: any) {
        console.log(URL_END_POINT_BASE_2 + path + insert)
        return this.http.post(URL_END_POINT_BASE_2 + path, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar agregar, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public actualizar(path: string, insert: any) {
        console.log(URL_END_POINT_BASE_2 + path + insert)
        return this.http.put(URL_END_POINT_BASE_2 + path, insert)
            .pipe(catchError(e => {
                console.error(' Error al intentar actualizar, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public eliminar(path: string, insert: any) {
        const options = {
            params: insert, // assuming insert is an object of key-value pairs for params
            headers: { 'Content-Type': 'application/json' }
          };
        console.log(URL_END_POINT_BASE_2 + path + options)
        return this.http.delete(URL_END_POINT_BASE_2 + path, options)
            .pipe(catchError(e => {
                console.error(' Error al intentar eliminar, Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    obtenerFoto(codiUsua: string, token: string ) {
        // console.log(OBTENERFOTO + codiUsua)
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