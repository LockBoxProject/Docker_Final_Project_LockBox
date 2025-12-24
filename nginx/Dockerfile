# ---- Stage 1: build frontend ----
FROM node:20-alpine AS build
WORKDIR /app

# מתקינים תלויות
COPY client-new/package*.json ./client-new/
RUN cd client-new && npm ci

# מעתיקים קוד ובונים
COPY client-new ./client-new
RUN cd client-new && npm run build

# ---- Stage 2: nginx serving static + reverse proxy ----
FROM nginx:alpine

# מעתיקים את תוצר הבנייה (dist) לתיקיית ההגשה של nginx
COPY --from=build /app/client-new/dist /usr/share/nginx/html

# קונפיג nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
