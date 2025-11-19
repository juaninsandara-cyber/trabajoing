FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar todo el código de la app
COPY . .

# Exponer el puerto (coincide con tu .env -> PORT=3000)
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "start"]
