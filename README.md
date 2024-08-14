# Aether

A simple note editor with word semantic search and more.

## Quickstart (for devs)

1. Install npm, Python, and Pipenv.
2. Run `cd backend && pipenv install`
3. Run `pipenv run python -m nltk.downloader -d ./nltk_data popular`
3. Then run `pipenv run fastapi run`
3. On another terminal window, run `cd frontend && npm install && npm start`.
4. Now you can visit <http://localhost:3000> for the app!
