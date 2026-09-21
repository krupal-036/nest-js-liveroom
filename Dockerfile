FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app/backend

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/public ./public

EXPOSE 3000

CMD ["node", "dist/main"]