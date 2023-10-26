using Domain.Common.Interfaces;

namespace plantilla_app_web.Middleware {
    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ValidateCachedParametersExtensions {
        public static IApplicationBuilder UseValidateCachedParameters( this IApplicationBuilder builder ) {
            return builder.UseMiddleware<ValidateCachedParameters>();
        }
    }
    public class ValidateCachedParameters {
        private readonly RequestDelegate _next;
        private readonly IParametersInMemory _parameters;

        public ValidateCachedParameters( RequestDelegate next, IParametersInMemory parameters ) {
            _next = next;
            _parameters = parameters;
            _parameters.ValidaParametros();
        }

        public Task Invoke( HttpContext httpContext ) {
            //VALIDACIÓN DE PARAMETROS EN MEMORIA CACHE
            _parameters.ValidaParametros();
            return _next(httpContext);
        }
    }
}
