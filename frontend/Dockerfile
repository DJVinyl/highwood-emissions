FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/

RUN npm install

COPY shared ./shared
COPY frontend ./frontend

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build -w shared
RUN npm run build -w frontend

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/build ./shared/build
COPY --from=builder /app/shared/package.json ./shared/package.json
COPY --from=builder /app/frontend ./frontend

EXPOSE 3000
CMD ["npm", "start", "-w", "frontend"]