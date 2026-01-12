FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar o código
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Iniciar aplicação
CMD ["npm", "start"]
