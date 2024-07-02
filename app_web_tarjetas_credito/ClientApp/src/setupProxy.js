const createProxyMiddleware = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:5000';

const context = [
    "/login",
    "/config",
    "/config/get/menu",
    "/config/get/funcionalidades",
    "/usuario/get/pregunta/usuario",
    "/usuario/get/validar/pregunta",
    "/usuario/get/preguntas",
    "/usuario/set/preguntas",
    "/usuario/set/password",
    "/usuario/set/password/primera",
    "/usuario/reset/password",
    "/logs/get/archivos",
    "/logs/get/contenido",
    "/logs/download/contenido",
    "/logs/get/bds",
    "/logs/get/colecciones",
    "/logs/get/documentos",
    "/logs/get/seguimiento",
    "/logs/get/conexiones",
    "/logs/add/conexion",
    "/logs/set/conexion",
    "/tarjetacredito/validacion",
    "/tarjetacredito/score",
    "/tarjetacredito/infoSocio",
    "/tarjetacredito/infoEco",
    "/tarjetacredito/getContrato",
    "/tarjetacredito/addAutorizacion",
    "/tarjetacredito/getSolicitudes",
    "/tarjetacredito/addSolicitud",
    "/tarjetacredito/getInfoFinan",
    "/tarjetacredito/addProspecto",
    "/tarjetacredito/getInforme",
    "/tarjetacredito/getFlujoSolicitud",
    "/tarjetacredito/addComentarioAsesor",
    "/tarjetacredito/addComentarioSolicitud",
    '/tarjetacredito/getResoluciones',
    '/tarjetacredito/addResolucion',
    '/tarjetacredito/updResolucion',
    "/tarjetacredito/getReporteOrden",
    "/tarjetacredito/getOrdenes",
    "/tarjetacredito/getTarjetasCredito",
    "/tarjetacredito/getMedioAprobacion",
    '/tarjetacredito/addProcEspecifico',
    '/tarjetacredito/updSolicitud',
    '/tarjetacredito/getParametros',
    '/tarjetacredito/getSeparadores',
    '/tarjetacredito/crearSeparadores',
    '/tarjetacredito/addDocumentosAxentria',
    '/tarjetacredito/getDocumentosAxentria',
    '/tarjetacredito/getReporteAval',
    '/tarjetacredito/getAlertasCliente',
    '/tarjetacredito/getMotivos'
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
      secure: false,
      pathRewrite: function (path, req) {
          req.headers[env.AUTH_KEY] = env.AUTH_BODY_KEY + " " + env.AUTH_BODY;
          return path;
      }
  });

  app.use(appProxy);
};
