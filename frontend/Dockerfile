FROM node:18-alpine
WORKDIR /app
COPY public/ /app/public/
COPY src/ /app/src/
COPY *.json *.config.js /app/
RUN npm install
ARG PORT
ENV port ${PORT}
EXPOSE $port
CMD ["npm", "start"]