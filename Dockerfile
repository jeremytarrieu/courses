# ----------- Build Stage -----------
FROM golang:1.25 AS builder

WORKDIR /app

# Téléchargement des dépendances
COPY go.mod go.sum ./
RUN go mod download

# Copie du code source
COPY . .

# Compilation du binaire
RUN CGO_ENABLED=0 GOOS=linux go build -o shopping ./cmd/app

# ----------- Run Stage -----------
FROM alpine:latest

WORKDIR /app

# Copie du binaire compilé
COPY --from=builder /app/shopping .

# Copie des fichiers statiques
COPY static/ ./static/

# Définition des variables d’environnement (valeurs par défaut)
ENV PASSWORD=changeme

# Port exposé
EXPOSE 8080

# Commande de lancement
CMD ["./shopping"]
