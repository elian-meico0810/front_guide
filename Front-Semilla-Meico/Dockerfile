FROM node:18

# Crea el directorio de trabajo
WORKDIR /usr/src/app

# Copia dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

# Instala dependencias
RUN npm install -g @angular/cli@17
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto de desarrollo Angular
EXPOSE 4200

# Comando por defecto (usado solo si no se sobreescribe desde docker-compose)
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
