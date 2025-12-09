"""
FastAPI ML Service for E-Commerce
Provides recommendation and image-based search APIs
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import json
from models.recommender import ProductRecommender
from models.image_search import ImageSearchEngine


# ============= Pydantic Models =============

class ProductHistory(BaseModel):
    """Product purchase history item"""
    productId: str
    category: str
    price: int


class UserRecommendationRequest(BaseModel):
    """Request for user-based recommendations"""
    userId: str
    user_history: List[ProductHistory] = Field(default_factory=list)
    top_k: int = Field(default=10, ge=1, le=50)


class SimilarProductRequest(BaseModel):
    """Request for similar products"""
    productId: str
    top_k: int = Field(default=10, ge=1, le=50)


class RecommendationResponse(BaseModel):
    """Single recommendation"""
    productId: str
    name: str
    category: str
    price: int
    score: float


class SimilarProductResponse(BaseModel):
    """Single similar product"""
    productId: str
    name: str
    category: str
    price: int
    similarity: float


class ImageSearchResponse(BaseModel):
    """Similar product from image search"""
    productId: str
    similarity: float


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str


# ============= Initialize App & Models =============

app = FastAPI(
    title="E-Commerce ML Service",
    description="ML Service for recommendations and image-based search",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
try:
    recommender = ProductRecommender("data/products.json")
    image_search = ImageSearchEngine("data/image_embeddings.npy", "data/product_ids.npy")
except Exception as e:
    print(f"Error initializing models: {e}")
    recommender = None
    image_search = None


# ============= Health Check =============

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "ML Service is running"
    }


# ============= Recommendation Endpoints =============

@app.post("/recommend/user", response_model=List[RecommendationResponse])
async def recommend_for_user(request: UserRecommendationRequest):
    """
    Get product recommendations for a user based on their history.
    
    Args:
        request: User ID and purchase history
        
    Returns:
        List of recommended products with scores
    """
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender not initialized")
    
    try:
        # Convert to list of dicts for recommender
        history = [
            {
                "productId": item.productId,
                "category": item.category,
                "price": item.price
            }
            for item in request.user_history
        ]
        
        recommendations = recommender.recommend_for_user(history, request.top_k)
        return recommendations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommend/similar-products", response_model=List[SimilarProductResponse])
async def recommend_similar_products(request: SimilarProductRequest):
    """
    Get similar products based on a target product.
    Similarity based on category and price.
    
    Args:
        request: Product ID
        
    Returns:
        List of similar products with similarity scores
    """
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender not initialized")
    
    try:
        # Check if product exists
        product = recommender.get_product(request.productId)
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {request.productId} not found"
            )
        
        similarities = recommender.recommend_similar_products(
            request.productId,
            request.top_k
        )
        return similarities
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= Image Search Endpoint =============

@app.post("/image-search", response_model=List[ImageSearchResponse])
async def search_by_image(file: UploadFile = File(...), top_k: int = 5):
    """
    Find similar products by uploading an image.
    Uses CNN embeddings and cosine similarity.
    
    Args:
        file: Image file (PNG, JPEG, etc.)
        top_k: Number of results to return
        
    Returns:
        List of similar products with similarity scores
    """
    if not image_search:
        raise HTTPException(status_code=500, detail="Image search not initialized")
    
    if top_k < 1 or top_k > 50:
        raise HTTPException(status_code=400, detail="top_k must be between 1 and 50")
    
    try:
        # Read image file
        contents = await file.read()
        
        # Search for similar products
        results = image_search.search_by_image(contents, top_k)
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")


# ============= Data Management Endpoints =============

@app.get("/products/count")
async def product_count():
    """Get total number of products in database."""
    if not recommender:
        return {"count": 0}
    return {"count": len(recommender.products)}


@app.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get product details by ID."""
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender not initialized")
    
    product = recommender.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product


# ============= Initialization Endpoint =============

@app.post("/init/embeddings")
async def init_embeddings(background_tasks: BackgroundTasks):
    """
    Build embeddings for all products.
    Runs in background to avoid blocking.
    """
    try:
        # Import here to avoid circular imports
        from build_embeddings import build_embeddings
        
        background_tasks.add_task(build_embeddings)
        return {"message": "Embedding generation started in background"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= Root Endpoint =============

@app.get("/")
async def root():
    """API documentation root"""
    return {
        "service": "E-Commerce ML Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "recommendations": {
                "user_based": "/recommend/user (POST)",
                "similar_products": "/recommend/similar-products (POST)"
            },
            "image_search": "/image-search (POST)",
            "products": {
                "count": "/products/count (GET)",
                "detail": "/products/{product_id} (GET)"
            },
            "initialization": "/init/embeddings (POST)"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
