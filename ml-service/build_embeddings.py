"""
Build embeddings for all products from their images.
Runs once to generate and cache embeddings.
"""

import json
import numpy as np
import requests
from PIL import Image
from io import BytesIO
import os
from models.image_search import ImageSearchEngine


def download_image(url: str) -> Image.Image:
    """
    Download image from URL.
    Falls back to placeholder if download fails.
    """
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return Image.open(BytesIO(response.content)).convert('RGB')
    except Exception as e:
        print(f"Warning: Could not download {url}: {e}")
    
    # Create placeholder image
    return Image.new('RGB', (224, 224), color=(73, 109, 137))


def build_embeddings():
    """
    Build embeddings for all products.
    Saves to data/image_embeddings.npy and data/product_ids.npy
    """
    print("Building product embeddings...")
    
    # Load products
    with open("data/products.json", 'r') as f:
        data = json.load(f)
        products = data.get("products", [])
    
    # Initialize search engine
    search_engine = ImageSearchEngine()
    
    # Process each product
    for i, product in enumerate(products):
        print(f"Processing {i+1}/{len(products)}: {product['name']}")
        
        # Download/get image
        image = download_image(product["imageUrl"])
        
        # Generate embedding
        embedding = search_engine.get_image_embedding(image)
        
        # Add to search engine
        search_engine.add_product_embedding(product["productId"], embedding)
    
    # Save embeddings
    embeddings_file = "data/image_embeddings.npy"
    product_ids_file = "data/product_ids.npy"
    
    search_engine.save_embeddings(embeddings_file, product_ids_file)
    
    print(f"✓ Saved {len(products)} embeddings to {embeddings_file}")
    print(f"✓ Saved product IDs to {product_ids_file}")


if __name__ == "__main__":
    build_embeddings()
