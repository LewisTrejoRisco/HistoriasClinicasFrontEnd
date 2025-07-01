// export const URL_END_POINT_BASE = 'http://localhost:8080';
export const URL_END_POINT_BASE = 'https://sicb.nettalco.com.pe/GestionHumanaWS'
//Auth
export const OBTENERTOKEN = "https://sicb.nettalco.com.pe/recursosHumanosWS/servicio/obtenerToken";
export const AUTENTICAR = "https://sicb.nettalco.com.pe/recursosHumanosWS/servicio/autenticarUsuario";
export const OBTENERFOTO = "https://sicb.nettalco.com.pe/recursosHumanosWS/servicio/obtenerFotoPersona/"
export const OBTENERDATOSBASICOS = "/autenticar/obtenerDatosBasicos?pCodipers="

//Comunes
export const SOLICITUDXUSUARIO = "/solicitud/listarXUsuarioGroupByStatus?codiUsua=";
export const SOLICITUD_HISTORIALXUSUARIO = "/solicitud/listarHistorialXUsuario?codiUsua=";
export const LISTAR_SOLICITUD_PENDIENTE = "/solicitud/listarSolicitudesXUsuarioXStatusXTipoSolicitud?";
export const LISTAR_SOLICITUD_APROBADA = "/solicitud/historialAprobados?";
export const APROBAR_SOLICITUD = "/solicitud/aprobarSolicitud";
export const RECHAZAR_SOLICITUD = "/solicitud/rechazarSolicitud";
export const GENERAR_PAGO = "/generar/pagoPersonasTiposolicitud?"
export const REPORTE_APROBADOSXAPROB = "/solicitud/buscarXTtiposolicitudIdAndTusuaaprobAndNotInTstatus?ttiposolicitudId=";
export const REPORTE_APROBADOS = "/solicitud/buscarXTipoSolicitudAndNotinStatus?ttiposolicitudId=";
export const LISTAR_TXT_CONTABILIDAD = "/generar/reporteTxtContabilidad?";

// Solicitar vacaciones
export const GRABAR_SOLICITUD = "/solicitud/grabarSolicitud";
export const REGLAS_VACACIONES = "/vacaciones/reglasVacaciones?";
export const COLISION_VACACIONES = "/vacaciones/colisionVacaciones?";

// Aprobar vacaciones
export const LISTAR_DETALLE_USUARIO = "/vacaciones/listarXSolicitud?tsolicitudId=";
export const LISTAR_SOLICITUD_VACACIONES_APROBADA = "/solicitud/listarHistorialVacacionesXStatusXTipo?";

// Solicitar permiso
export const SOLICITUD_HISTORIALPERMISOXUSUARIO = "/solicitud/listarHistorialPermisoXUsuario?codiUsua=";
export const GRABAR_PERMISO = "/solicitud/grabarPermiso";

// Aprobar permiso
export const LISTAR_DETALLE_USUARIO_PERMISO = "/permisos/listarXSolicitud?tsolicitudId=";

// Solicitar licencia
export const SOLICITUD_HISTORIALLICENCIAXUSUARIO = "/solicitud/listarHistorialLicenciaXUsuario?codiUsua=";
export const GRABAR_LICENCIA = "/solicitud/grabarLicencia";

// Aprobar licencia
export const LISTAR_DETALLE_USUARIO_LICENCIA = "/licencias/listarXSolicitud?tsolicitudId=";

// Solicitar movilidad
export const GRABAR_MOVILIDAD = "/solicitud/grabarMovilidad";
export const SOLICITUD_HISTORIALMOVILIDADXUSUARIO = "/solicitud/listarHistorialMovilidadXUsuario?codiUsua=";
export const LISTAR_DISTRITO = "/movilidad/listarDistritos";
export const LISTAR_SOLICITUD_MOVILIDAD_APROBADA = "/solicitud/listarHistorialMovilidadXStatusXTipo?";

// Aprobar movilidad
export const LISTAR_DETALLE_USUARIO_MOVILIDAD = "/movilidad/listarXSolicitud?tsolicitudId=";

//Banco BBVA
export const PRIMER_ORDENANTE = "2110";
export const SEGUNDO_ORDENANTE = "2120";
export const PRIMER_BENEFICIARIO = "2210";
export const PRIMER_BENEFICIARIO_SEGUNDO = "2220";
export const REGISTRO_TOTALES = "2910";
export const TIPO_DOCUMENTO_RUC = "R";
export const DOCUMENTO_RUC_ORDENANTE = "20100064571";
export const CUENTA_ORDENANTE = "00110686320100006627";
export const NOMBRE_ORDENANTE = "INDUSTRIAS NETTALCO SA";
export const DIVISA_CUENTA_SOLES = "PEN";
export const VALIDACION_PERTENENCIA_VALIDA = "1";
export const INDICADOR_DEVOLUCION = "0";
export const SERVICIO_QUINTA_CATEGORIA = "108";
export const CODIGO_DEVOLUCION = "0000";
export const CODIGO_BANCO_CUENTA_BENEFICIARIO = "0011";
export const TIPO_ABONO_PROPIO = "P";
export const TIPO_CUENTA_TITULAR = "00";

//Banco BCP
export const TIPO_REGISTRO = "1";
export const PLANILLA_HABERES = "X";
export const CUENTA_CARGO = "C";
export const MONEDA_CARGO_SOLES = "0001"
export const TIPO_REGISTRO_BENEFICIARIO = "2";
export const TIPO_CUENTA_ABONO_AHORRO = "A";
export const TIPO_DOCUMENTO_DNI = "DNI";
export const TIPO_DOCUMENTO_CE = "CE";
export const TIPO_DOCUMENTO_PAS = "PASS";
export const MONEDA_IMPORTE_SOLES = "0001";
export const FLAG_IDC = "S";
export const NUMERO_CUENTA_CARGO = "1930454658003"



// export const URL_END_POINT_BASE_2 = 'http://128.0.17.3:8082';
// export const URL_END_POINT_BASE_2 = 'http://128.0.1.208:8082';
// export const URL_END_POINT_BASE_2 = '/api';
export const URL_END_POINT_BASE_2 = '/historiasclinicasbackend';
// export const URL_END_POINT_BASE_2 = 'http://128.0.1.210/historiasclinicasbackend';
// export const URL_END_POINT_BASE_COMMON = 'http://128.0.1.210/commonbackend';
export const URL_END_POINT_BASE_COMMON = '/commonbackend';
// INFORMACION PERSONAL
// export const OBTENERDATOS = "/common/listXColaborador?tcodipers="
export const FINDBYTCODIPERS = '/common/findByTcodipers';
export const LISTARXCODIGO = '/common/listXColaborador';
export const LISTARXNOMBRE = '/common/listColaByTnomb';
// ANTECEDENTES PATOLOGICOS
export const LISTAR_ANTEPATOXPER = '/antecePatoloXPerso/listByCodipers';
export const LISTAR_EMOXPERSONA_FIRS_LAST = '/histeEmoPers/findByFirsOrLast';
export const LISTAR_ALERGIA_PERSONA = '/persXAler/findByTcodipersAndTstatus';
export const LIKE_ANTEPATO = '/antecePatolo/findByParam';
export const INSERT_AP = '/antecePatolo/insert';
export const INSERT_APXPER = '/antecePatoloXPerso/insert';
export const UPDATE_APXPER = '/antecePatoloXPerso/update';
export const DELETE_APXPER = '/antecePatoloXPerso/delete';
// ANTECEDENTES OCUPACIONALES 
//           => EMO
export const LISTAR_EMOXPERSONA_AO = '/histeEmoPers/findByFirsAndLast';
export const FINDBYIDHISTEMOPERS = '/persXAptiEmo/findByIdHistEmoXPers';
export const INSERT_AOXPER = '/histeEmoPers/insert';
export const UPDATE_AOXPER = '/histeEmoPers/update';
export const DELETE_AOXPER = '/histeEmoPers/delete';
//           => APTITUD EMO
export const LISTAR_APTITUDEMO_AO = '/aptitudeemo/listall';
export const INSERT_APTITUDEMO_AOXPER = '/persXAptiEmo/insert';
export const UPDATE_APTITUDEMO_AOXPER = '/persXAptiEmo/update';
export const DELETE_APTITUDEMO_AOXPER = '/persXAptiEmo/delete';
//           => ESPECIALIDAD
export const LISTAR_ESPECIALIDAD_AO = "/especialidad/findByParam";
export const INSERT_ESPECIALIDAD_AO = '/especialidad/insert';
//           => RESTRICCIÓN
export const LISTAR_RESTRICCION_AO = "/restriccion/findByParam";
export const INSERT_RESTRICCION_AO = "/restriccion/insert";
// ACCIDENTES LABORALES
export const LISTAR_ACCIDENTESLABORALES_PERSONA = '/accidenteLaboral/findByTcodipers';
export const INSERT_ACCILABO = "/accidenteLaboral/insert";
export const UPDATE_ACCILABO = "/accidenteLaboral/update";
export const DELETE_ACCILABO = "/accidenteLaboral/delete";
// VACUNAS POR PERSONA
export const LISTAR_VACUNAXPERS = '/persxvacuna/findByTcodipers';
export const INSERT_VACUNAXPERS = "/persxvacuna/insert";
export const UPDATE_VACUNAXPERS = "/persxvacuna/update";
export const DELETE_VACUNAXPERS = "/persxvacuna/delete";
// VACUNAS 
export const LISTAR_VACUNA = '/vacuna/findByParam';
export const INSERT_VACUNA = "/vacuna/insert";
export const UPDATE_VACUNA = "/vacuna/update";
export const DELETE_VACUNA = "/vacuna/delete";
// ATENCION MEDICA 
export const LISTAR_ATENCIONMEDICA = '/atencionmedica/findByTcodipers';
export const INSERT_ATENCIONMEDICA = "/atencionmedica/insert";
export const UPDATE_ATENCIONMEDICA = "/atencionmedica/update";
export const DELETE_ATENCIONMEDICA = "/atencionmedica/delete";
// GESTANTE 
export const LISTAR_GESTANTE = '/gestante/findByTcodipers';
export const INSERT_GESTANTE = "/gestante/insert";
export const UPDATE_GESTANTE = "/gestante/update";
export const DELETE_GESTANTE = "/gestante/delete";
// REPORTE
export const REPORTEMOXVENCER = '/reporte/reportemoxvencer';
export const REPORTEMOOBSERVADA = "/reporte/reportemoobservada";
export const REPORTACCIDENTE = "/reporte/accidentelaboral";
export const REPORTATENCIONMEDICA = "/reporte/reportatencionmedica";
// ALERGIAS
export const INSERT_ALLERGIA = "/allergy/insert";
export const LISTAR_ALLERGIA = "/allergy/listbyParam";
export const INSERT_ALERGIA_PERSONA = '/persXAler/insert';