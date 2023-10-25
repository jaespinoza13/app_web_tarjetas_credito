using Domain.Common.Interfaces;
using Infrastructure.MemoryCache;

namespace Microsoft.Extensions.DependencyInjection;
public static class ConfigureInfrastructure {
    public static IServiceCollection AddInfrastructureServices( this IServiceCollection services ) {
        services.AddSingleton<ParametersInMemory>();

        services.AddTransient<IParametersInMemory, ParametersInMemory>();
        return services;
    }
}
