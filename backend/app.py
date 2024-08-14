from typing import TypedDict
import re

from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, String, create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLALCHEMY_DATABASE_URL = "sqlite:///./notes.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class NoteTypedDict(TypedDict):
    note_id: str
    title: str
    content: str


class Note(Base):
    __tablename__ = "notes"
    note_id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/notes", response_model=list[dict[str, str]])
def get_all_notes(db: Session = Depends(get_db)):
    query_results = db.query(Note.note_id, Note.title).all()
    return [{"note_id": note_id, "title": title} for note_id, title in query_results]


@app.get("/notes/{note_id}", response_model=dict[str, str])
def get_note_by_id(note_id: str, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"title": note.title, "content": note.content}


@app.post("/notes", response_model=list[dict[str, str]])
def create_note(notes: list[dict[str, str]], db: Session = Depends(get_db)):
    new_notes = [
        Note(note_id=note["note_id"], title=note["title"], content=note["content"])
        for note in notes
    ]
    db.add_all(new_notes)
    db.commit()
    return [{"note_id": note.note_id, "title": note.title} for note in new_notes]


@app.delete("/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return JSONResponse(content={"message": "Note deleted successfully"})


@app.websocket("/notes/{note_id}")
async def update_note(
    websocket: WebSocket, note_id: str, db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    await websocket.accept()
    await websocket.send_json({"note_id": note.note_id, "title": note.title, "content": note.content})
    try:
        while True:
            data = await websocket.receive_json()
            note.title = data["title"]
            note.content = data["content"]
            db.commit()
    except WebSocketDisconnect:
        pass

@app.websocket("/search/exact")
async def search_exact(websocket: WebSocket, db: Session = Depends(get_db)):
    EXACT_SEARCH_QUERY = text("""
    WITH counts_table AS (
        SELECT note_id, (LENGTH(content) - LENGTH(REPLACE(content, :search, ''))) / LENGTH(:search) AS count
        FROM notes
    )
    SELECT notes.note_id, notes.title, counts_table.count
    FROM notes
    INNER JOIN counts_table ON notes.note_id = counts_table.note_id
    WHERE counts_table.count > 0
    ORDER BY counts_table.count DESC
    """)
    await websocket.accept()
    try:
        while True:
            search_term = await websocket.receive_text()
            results = db.execute(EXACT_SEARCH_QUERY, {"search": search_term}).all()
            await websocket.send_json([{"note_id": row.note_id, "title": row.title, "num_occurrences": row.count} for row in results])
    except WebSocketDisconnect:
        pass

@app.websocket("/search/regex")
async def search_regex(websocket: WebSocket, db: Session = Depends(get_db)):
    REGEX_SEARCH_QUERY = text("SELECT * FROM notes WHERE content REGEXP :search")
    await websocket.accept()
    try:
        while True:
            search_term = await websocket.receive_text()
            results = db.execute(REGEX_SEARCH_QUERY, {"search": search_term}).all()
            pattern = re.compile(search_term)
            results = [{"note_id": row.note_id, "title": row.title, "num_occurrences": len(pattern.findall(row.content))} for row in results]
            await websocket.send_json(results)
    except WebSocketDisconnect:
        pass

# @app.websocket("/search/semantic")