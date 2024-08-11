from typing import TypedDict

from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, String, create_engine
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
