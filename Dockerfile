#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src
COPY ["plantilla_app_web/plantilla_app_web.csproj", "plantilla_app_web/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["Domain/Domain.csproj", "Domain/"]
RUN dotnet restore "plantilla_app_web/plantilla_app_web.csproj"

COPY . .
WORKDIR "/src/plantilla_app_web"
RUN dotnet build "plantilla_app_web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "plantilla_app_web.csproj" -c Release -o /app/publish

FROM node:18.12.1 as node-builder
WORKDIR /node
COPY ./plantilla_app_web/ClientApp /node
ENV NODE_ENV production
RUN npm cache clean --force
RUN npm install
RUN npm run build

FROM base AS final
WORKDIR /app
RUN mkdir /app/wwwroot
COPY --from=publish /app/publish .
COPY --from=node-builder /node/build ./wwwroot
ENTRYPOINT ["dotnet", "plantilla_app_web.dll"]
