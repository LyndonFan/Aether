FROM python:3.12-slim-bookworm
WORKDIR /app
COPY main.py /app/
COPY vector_database.py /app/
COPY requirements.txt /app/

# manually install libraries
# as sentence-transformers is bloated by default
# https://stackoverflow.com/questions/77205123/how-do-i-slim-down-sberts-sentencer-transformer-library
RUN grep -Eo "torch==[0.9]+\.[0-9]+\.[0-9]+" requirements.txt | xargs -I {} pip install --no-cache-dir {} --index-url https://download.pytorch.org/whl/cpu
RUN grep -Eo "sentence-transformers==[0.9]+\.[0-9]+\.[0-9]+" requirements.txt | xargs -I {} pip install --no-cache-dir {} --index-url https://download.pytorch.org/whl/cpu
RUN grep -v torch requirements.txt | grep -v sentence-transformers | cut -d ";" -f 1 | grep "==" | xargs pip install --no-cache-dir

ARG DB_PORT
ENV DB_PORT=$DB_PORT
EXPOSE $DB_PORT

RUN chown daemon -R /app
USER daemon
# needed to expand "$DB_PORT"
CMD ["sh", "-c", "fastapi run main.py --port $DB_PORT"]
