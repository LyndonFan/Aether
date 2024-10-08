FROM python:3.12-slim-bookworm
WORKDIR /app
COPY __init__.py main.py vector_database.py requirements.txt /app/

# manually install libraries
# as sentence-transformers is bloated by default
# https://stackoverflow.com/questions/77205123/how-do-i-slim-down-sberts-sentencer-transformer-library
RUN grep -Eo "torch==[0-9]+\.[0-9]+\.[0-9]+" requirements.txt | \
    xargs -I {} pip install --no-cache-dir {} --index-url https://download.pytorch.org/whl/cpu && \
    grep -Eo "sentence-transformers==[0-9]+\.[0-9]+\.[0-9]+" requirements.txt | \
    xargs pip install --no-cache-dir && \
    grep -v torch requirements.txt | grep -v sentence-transformers | cut -d ";" -f 1 | grep "==" | xargs pip install --no-cache-dir && \
    rm -rf /root/.cache/pip

ARG DB_PORT
ENV DB_PORT=$DB_PORT
EXPOSE $DB_PORT

# give it full permission in /usr/sbin for hugging face
RUN chmod 777 /usr/sbin
RUN chown daemon -R /app
USER daemon
# needed to expand "$DB_PORT"
CMD ["sh", "-c", "fastapi run main.py --port $DB_PORT"]
