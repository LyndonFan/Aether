FROM python:3.12-slim-bookworm
WORKDIR /app
COPY main.py /app/
COPY requirements.txt /app/
COPY vector_database.py /app/
RUN pip install -r requirements.txt
RUN chown daemon -R /app
USER daemon
ARG DB_PORT
ENV db_port $DB_PORT
EXPOSE $db_port
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", $db_port]
