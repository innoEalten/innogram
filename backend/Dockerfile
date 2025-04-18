FROM node:23-alpine AS build
ARG APP
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- ${APP}


FROM node:23-alpine
ARG APP
WORKDIR /app
COPY --from=build /app/dist/apps/${APP} ./dist
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci
EXPOSE 3000
CMD ["node", "dist/main"]



# ENV APP=${APP}
# CMD ["sh", "-c", "node dist/apps/${APP}/main"]
