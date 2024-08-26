import re
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .vector_database import collection

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


@app.get("/notes", response_model=list[dict[str, str]])
def get_all_notes():
    query_results = collection.get(include=["metadatas"])
    return [
        {"note_id": note_id, "title": metadata["title"]}
        for note_id, metadata in zip(query_results["ids"], query_results["metadatas"])
    ]


@app.get("/notes/{note_id}", response_model=dict[str, str])
def get_note_by_id(note_id: str):
    note = collection.get(ids=[note_id])[0]
    return {"title": note.title, "content": note.content}


@app.post("/notes", response_model=list[dict[str, str]])
def create_note(notes: list[dict[str, str]]):
    collection.add(
        ids=[note["note_id"] for note in notes],
        documents=[note["content"] for note in notes],
        metadatas=[{"title": note["title"]} for note in notes],
    )
    return [{"note_id": note["note_id"], "title": note["title"]} for note in notes]


@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    collection.delete(ids=[note_id])
    return JSONResponse(content={"message": "Note deleted successfully"})


@app.websocket("/notes/{note_id}")
async def update_note(websocket: WebSocket, note_id: str):
    notes = collection.get(ids=[note_id])
    if not notes:
        raise HTTPException(status_code=404, detail="Note not found")
    await websocket.accept()
    await websocket.send_json(
        {
            "note_id": note_id,
            "title": notes["metadatas"][0]["title"],
            "content": notes["documents"][0],
        }
    )
    try:
        while True:
            data = await websocket.receive_json()
            collection.update(
                ids=[note_id],
                documents=[data["content"]],
                metadatas=[{"title": data["title"]}],
            )
    except WebSocketDisconnect:
        pass


@app.websocket("/search")
async def search(websocket: WebSocket):
    search_type = None
    search_term = None
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            if "search_type" in data:
                if data["search_type"] in ["exact", "regex", "semantic"]:
                    search_type = data["search_type"]
                else:
                    raise ValueError("unknown search type")
            elif "search_term" in data:
                search_term = data["search_term"]
            if search_type is None:
                raise ValueError("search type not specified")
            if not search_type or search_term is None:
                continue
            query_results = collection.get()
            if search_type == "exact":
                # no default case-insensitive search
                results = [
                    {
                        "note_id": note_id,
                        "title": metadata["title"],
                        "num_occurrences": content.lower().count(search_term.lower()),
                    }
                    for note_id, metadata, content in zip(
                        query_results["ids"],
                        query_results["metadatas"],
                        query_results["documents"],
                    )
                ]
                results = [dct for dct in results if dct["num_occurrences"] > 0]
            elif search_type == "regex":
                try:
                    pattern = re.compile(search_term)
                    relevant_row_indexes = [
                        i
                        for i, doc in enumerate(query_results["documents"])
                        if re.search(search_term, doc)
                    ]
                    results = [
                        {
                            "note_id": query_results["ids"][index],
                            "title": query_results["metadatas"][index]["title"],
                            "num_occurrences": len(
                                pattern.findall(query_results["documents"][index])
                            ),
                        }
                        for index in relevant_row_indexes
                    ]
                except re.error:
                    print("warning: invalid regex", search_term)
                    # and default to last known results
            elif search_type == "semantic":
                query_results = collection.query(
                    query_texts=[search_term], include=["metadatas", "distances"]
                )
                results = [
                    {"note_id": nid, "title": metadata["title"], "distance": dist}
                    for nid, metadata, dist in zip(
                        query_results["ids"][0],
                        query_results["metadatas"][0],
                        query_results["distances"][0],
                    )
                ]
            await websocket.send_json(results)
    except WebSocketDisconnect:
        pass
