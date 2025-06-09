"""
@fileoverview Orion's primary Python backend server using FastAPI.
@description This file defines all API endpoints for specialized Python-based logic,
including memory/embedding services, web research/scraping, and Notion integrations.
It serves as the main entry point for the uvicorn server and is called by the Next.js frontend.
"""

# --- Core Imports ---
import os
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, cast

# --- Framework Imports ---
from fastapi import FastAPI, HTTPException, Depends, Security, status, Request
from fastapi.security import APIKeyHeader
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- Orion Module Imports ---
from orion_memory import get_embedding_model
from orion_notion import orion_notion_client as notion
from orion_networking import find_potential_stakeholders
from orion_utils import (
    scrape_with_aiohttp,
    scrape_multiple,
    search_and_extract_web_context,
    google_search,
)
from orion_config import JOB_APPLICATION_STATUSES_FOR_TRACKING

# --- App & Security Setup ---
app = FastAPI(
    title="Orion Python Backend API",
    description="Provides specialized services for embedding, web research, and complex logic.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# API Security Configuration
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != os.getenv("ORION_API_KEY"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
    return api_key

# Rate Limiter Configuration
limiter = Limiter(key_func=get_remote_address)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.state.limiter = limiter

# Error handlers
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Too many requests"})

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

# --- Pydantic Models for Request/Response Validation ---

class EmbeddingRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1, description="A list of texts to be embedded.")

class EmbeddingResponse(BaseModel):
    success: bool
    embeddings: Optional[List[List[float]]] = None
    error: Optional[str] = None

class JobOpportunity(BaseModel):
    id: str
    title: str
    company: str
    status: str
    last_activity_date: datetime

class FollowUpTask(BaseModel):
    opportunity_id: str
    type: str
    notes: Optional[str] = None

class StakeholderRequest(BaseModel):
    companyName: str
    roles: Optional[List[str]] = None

class ScrapeAiohttpRequest(BaseModel):
    url: str
    body_only: Optional[bool] = False
    retries: Optional[int] = 2
    delay: Optional[int] = 1
    timeout: Optional[int] = 15

class ScrapeMultipleRequest(BaseModel):
    urls: List[str]
    use_selenium: Optional[bool] = False
    body_only: Optional[bool] = False
    browser: Optional[str] = "chrome"
    headless: Optional[bool] = True

class WebContextRequest(BaseModel):
    query: str
    num_results: Optional[int] = 5

class GoogleSearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 10

class ScrapeRequest(BaseModel):
    url: str

# --- API ENDPOINTS ---

@app.get("/api/v1/_debug/routes", tags=["Debug"], include_in_schema=False)
async def get_all_routes():
    """A temporary debug endpoint to list all available API routes."""
    routes = []
    for route in app.routes:
        if isinstance(route, APIRoute):
            routes.append({
                "path": route.path,
                "name": route.name,
                "methods": sorted(list(route.methods)),
            })
    return routes

@app.post("/api/v1/embeddings/generate", response_model=EmbeddingResponse, summary="Generate Text Embeddings")
@limiter.limit("60/minute")
async def generate_embeddings_endpoint(request: Request, body: EmbeddingRequest):
    """
    Accepts a list of texts and returns their corresponding sentence-transformer embeddings.
    This endpoint uses the centrally loaded embedding model from orion_memory.py.
    """
    log_context = { "route": "/api/v1/embeddings/generate", "num_texts": len(body.texts) }
    logging.info("Embedding endpoint called.", extra=log_context)

    try:
        embedding_model = get_embedding_model()
        if embedding_model is None:
            logging.error("Embedding model is not available.", extra=log_context)
            raise HTTPException(status_code=503, detail="Embedding model is not loaded or configured correctly.")

        vectors = embedding_model.encode(body.texts, show_progress_bar=False)
        vectors = [v.tolist() for v in vectors]
        logging.info("Embeddings generated successfully.", extra=log_context)
        return EmbeddingResponse(success=True, embeddings=vectors)
    except Exception as e:
        logging.error(f"Failed to generate embeddings: {e}", exc_info=True, extra=log_context)
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")

@app.post("/search/web", summary="Perform a web search and extract context")
async def search_web_endpoint(request: WebContextRequest):
    """
    Performs a Google search and scrapes the top results to provide context.
    """
    import logging
    logging.info(f"Received web search request for query: {request.query}")
    try:
        snippets, scraped_content = await search_and_extract_web_context(
            request.query, num_results=request.num_results if request.num_results is not None else 5
        )
        return {"snippets": snippets, "scraped_content": scraped_content}
    except Exception as e:
        logging.error(f"Error during web search for '{request.query}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape", summary="Scrape a single URL")
async def scrape_endpoint(request: ScrapeRequest):
    """
    Scrapes the text content from a single provided URL.
    """
    import logging
    logging.info(f"Received scrape request for URL: {request.url}")
    try:
        results = await scrape_multiple(
            urls=[request.url],
            use_selenium=True,
            body_only=True
        )
        if results and results[0]:
            return {"success": True, "results": results[0]}
        else:
            raise HTTPException(status_code=500, detail="Scraping returned no content.")
    except Exception as e:
        logging.error(f"Error during scrape for '{request.url}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/active-applications", response_model=List[JobOpportunity])
async def get_active_applications():
    """Get all active job applications that might need follow-up."""
    if (
        not notion.is_configured()
        or not notion.job_opportunities_db
        or not notion.client
    ):
        raise HTTPException(status_code=500, detail="Notion not properly configured")

    try:
        # Query Notion database for active applications
        response = await notion.client.databases.query(
            database_id=notion.job_opportunities_db,
            filter={"and": [{"property": "Status", "select": {"equals": "Applied"}}]},
        )

        response_dict = cast(Dict[str, Any], response)
        opportunities = []
        for page in response_dict.get("results", []):
            opportunity = await extract_opportunity_data(page)
            opportunities.append(opportunity)

        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create-followup-task")
async def create_followup_task(task: FollowUpTask):
    """Create a follow-up task for a job application."""
    if not notion.is_configured() or not notion.tasks_db or not notion.client:
        raise HTTPException(status_code=500, detail="Notion not properly configured")

    try:
        # Get opportunity details
        opportunity = await notion.get_opportunity_details(task.opportunity_id)
        if not opportunity:
            raise HTTPException(status_code=404, detail="Opportunity not found")

        properties = opportunity.get("properties", {})
        company = (
            properties.get("Company", {})
            .get("rich_text", [{}])[0]
            .get("text", {})
            .get("content", "")
        )
        title = (
            properties.get("Title", {})
            .get("title", [{}])[0]
            .get("text", {})
            .get("content", "")
        )

        # Create follow-up task
        await notion.client.pages.create(
            parent={"database_id": notion.tasks_db},
            properties={
                "Name": {
                    "title": [{"text": {"content": f"Follow up - {company} {title}"}}]
                },
                "Description": {
                    "rich_text": [
                        {
                            "text": {
                                "content": task.notes
                                or "Time to follow up on application"
                            }
                        }
                    ]
                },
                "Status": {"select": {"name": "To Do"}},
                "Priority": {"select": {"name": "High"}},
                "Related Opportunity": {"relation": [{"id": task.opportunity_id}]},
                "Due Date": {
                    "date": {"start": (datetime.now() + timedelta(days=1)).isoformat()}
                },
            },
        )

        return {"message": "Follow-up task created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/find_stakeholders", summary="Find potential stakeholders for a company")
@limiter.limit("10/minute")
async def find_stakeholders_endpoint(request: StakeholderRequest, api_key: str = Depends(get_api_key)):
    try:
        stakeholders = await find_potential_stakeholders(
            query=request.companyName,
            roles=request.roles
        )
        return {"stakeholders": stakeholders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/utils/scrape_with_aiohttp")
async def scrape_with_aiohttp_endpoint(request: ScrapeAiohttpRequest):
    result = await scrape_with_aiohttp(
        request.url,
        body_only=request.body_only or False,
        retries=request.retries or 2,
        delay=request.delay or 1,
        timeout=request.timeout or 15,
    )
    return {"result": result}

@app.post("/utils/scrape_multiple")
async def scrape_multiple_endpoint(request: ScrapeMultipleRequest):
    results = await scrape_multiple(
        request.urls,
        use_selenium=request.use_selenium or False,
        body_only=request.body_only or False,
        browser=request.browser or "chrome",
        headless=request.headless or True,
    )
    return {"results": results}

@app.post("/utils/search_and_extract_web_context")
async def search_and_extract_web_context_endpoint(request: WebContextRequest):
    snippets, scraped_content = await search_and_extract_web_context(
        request.query, num_results=request.num_results if request.num_results is not None else 5
    )
    return {
        "snippets": snippets,
        "scraped_content": scraped_content
    }

@app.post("/utils/google_search")
async def google_search_endpoint(request: GoogleSearchRequest):
    results = await google_search(request.query, max_results=request.max_results or 10)
    return {"results": results}

async def extract_opportunity_data(page: Dict[str, Any]) -> JobOpportunity:
    """Extract job opportunity data from Notion page object."""
    try:
        properties = page.get("properties", {})
        title_content = (
            properties.get("Title", {})
            .get("title", [{}])[0]
            .get("text", {})
            .get("content", "")
        )
        company_content = (
            properties.get("Company", {})
            .get("rich_text", [{}])[0]
            .get("text", {})
            .get("content", "")
        )
        status_name = properties.get("Status", {}).get("select", {}).get("name", "")
        last_edited = page.get("last_edited_time", datetime.now().isoformat())

        return JobOpportunity(
            id=page["id"],
            title=title_content,
            company=company_content,
            status=status_name,
            last_activity_date=datetime.fromisoformat(last_edited),
        )
    except (KeyError, IndexError, ValueError) as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to parse opportunity data: {str(e)}"
        )
