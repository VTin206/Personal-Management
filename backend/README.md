# Personal Management Backend

Spring Boot backend skeleton for the Personal Management app.

## Requirements

- Java 21 or newer
- Maven is optional because the project includes Maven Wrapper

## Run locally

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`.

Health checks:

- `GET http://localhost:8080/api/health`
- `GET http://localhost:8080/actuator/health`

## Project structure

```text
src/main/java/com/personalmanagement/backend/
  api/        REST controllers
  config/     application configuration
```

## Frontend CORS

By default, `/api/**` accepts requests from:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Update `app.cors.allowed-origins` in `src/main/resources/application.properties` if your Vite frontend uses another host or port.
