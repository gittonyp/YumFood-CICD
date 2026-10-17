FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build-frontend
EXPOSE 4000
CMD ["npm", "start"]