FROM golang:1.27-alpine AS build
RUN apk add --no-cache nodejs npm
WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN cp -r /app/frontend/dist ./dist
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /app/server .

FROM scratch
COPY --from=build /app/server /server
ENV DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/app?sslmode=disable
EXPOSE 8080
ENTRYPOINT ["/server"]