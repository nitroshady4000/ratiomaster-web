FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier et restaurer les dépendances
COPY ["RatioMasterAPI/RatioMasterAPI.csproj", "RatioMasterAPI/"]
COPY ["RatioMaster.Core/RatioMaster.Core.csproj", "RatioMaster.Core/"]
RUN dotnet restore "RatioMasterAPI/RatioMasterAPI.csproj"

# Copier le code source
COPY . .
WORKDIR "/src/RatioMasterAPI"
RUN dotnet build "RatioMasterAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RatioMasterAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

# Installer les dépendances système si nécessaire
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Créer les dossiers de données
RUN mkdir -p /app/data/sessions /app/data/logs

# Santé check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["dotnet", "RatioMasterAPI.dll"]
