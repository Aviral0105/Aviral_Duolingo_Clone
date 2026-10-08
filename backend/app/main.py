from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed import seed_database
from .routes import users, path, lessons, leaderboard, shop, help, achievements

# Initialize tables & seed database on startup
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="Duolingo Web Clone API",
    description="Clean, modular FastAPI backend supporting interactive lessons, gamification, and progress tracking.",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(users.router)
app.include_router(path.router)
app.include_router(lessons.router)
app.include_router(leaderboard.router)
app.include_router(shop.router)
app.include_router(help.router)
app.include_router(achievements.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Duolingo Clone Backend API",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
