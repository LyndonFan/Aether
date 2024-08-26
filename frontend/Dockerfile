FROM node:18-alpine
WORKDIR /app
ARG PORT
ENV PORT ${PORT}
ARG REACT_APP_DATABASE_HOST_PORT
ENV REACT_APP_DATABASE_HOST_PORT ${REACT_APP_DATABASE_HOST_PORT}
EXPOSE $PORT
COPY *.json *.config.js /app/
COPY public/ /app/public/
COPY src/ /app/src/
RUN npm install -g serve
RUN npm install
RUN npm run build
# needed to expand "$PORT"
CMD ["sh", "-c", "serve -s build -l $PORT"]