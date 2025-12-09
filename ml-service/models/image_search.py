"""
Image-based product search using pre-trained CNN embeddings.
Uses ResNet50 for image feature extraction and cosine similarity for matching.
"""

import numpy as np
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
from PIL import Image
import io
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Tuple
import os


class ImageSearchEngine:
    def __init__(self, embeddings_file: str = "data/image_embeddings.npy", 
                 product_ids_file: str = "data/product_ids.npy"):
        """Initialize image search with pre-computed embeddings."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model()
        self.transform = self._get_transforms()
        
        # Load embeddings and product IDs
        self.embeddings = None
        self.product_ids = None
        self._load_embeddings(embeddings_file, product_ids_file)
    
    def _load_model(self):
        """Load pre-trained ResNet50 model."""
        try:
            model = resnet50(pretrained=True)
            # Remove the final classification layer to get feature vectors
            model = torch.nn.Sequential(*list(model.children())[:-1])
            model.to(self.device)
            model.eval()
            return model
        except Exception as e:
            print(f"Warning: Could not load ResNet50: {e}")
            print("Image search will use random embeddings for demo")
            return None
    
    def _get_transforms(self):
        """Get image preprocessing transforms."""
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def _load_embeddings(self, embeddings_file: str, product_ids_file: str):
        """Load pre-computed embeddings and product IDs."""
        try:
            if os.path.exists(embeddings_file) and os.path.exists(product_ids_file):
                self.embeddings = np.load(embeddings_file)
                self.product_ids = np.load(product_ids_file, allow_pickle=True)
            else:
                print(f"Warning: Embedding files not found. Will initialize empty.")
                self.embeddings = np.array([]).reshape(0, 2048)
                self.product_ids = np.array([])
        except Exception as e:
            print(f"Error loading embeddings: {e}")
            self.embeddings = np.array([]).reshape(0, 2048)
            self.product_ids = np.array([])
    
    def get_image_embedding(self, image) -> np.ndarray:
        """
        Generate embedding for an image.
        
        Args:
            image: PIL Image or bytes
            
        Returns:
            1D numpy array of embeddings (2048-dim for ResNet50)
        """
        if isinstance(image, bytes):
            image = Image.open(io.BytesIO(image)).convert('RGB')
        elif not isinstance(image, Image.Image):
            image = Image.open(image).convert('RGB')
        
        # Preprocess image
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Generate embedding
        with torch.no_grad():
            if self.model is not None:
                embedding = self.model(image_tensor)
                embedding = embedding.view(embedding.size(0), -1)
                embedding = embedding.cpu().numpy().flatten()
            else:
                # Demo: random 2048-dim embedding
                embedding = np.random.randn(2048)
        
        return embedding
    
    def search_by_image(self, image, top_k: int = 5) -> List[Dict]:
        """
        Find similar products by image.
        
        Args:
            image: PIL Image or bytes
            top_k: Number of similar products to return
            
        Returns:
            List of similar products with similarity scores
        """
        if self.embeddings is None or len(self.embeddings) == 0:
            return []
        
        # Get query embedding
        query_embedding = self.get_image_embedding(image)
        
        # Compute similarities with all products
        similarities = cosine_similarity(
            [query_embedding],
            self.embeddings
        )[0]
        
        # Get top-k similar products
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            results.append({
                "productId": str(self.product_ids[idx]),
                "similarity": float(similarities[idx])
            })
        
        return results
    
    def add_product_embedding(self, product_id: str, embedding: np.ndarray):
        """
        Add or update a product embedding.
        
        Args:
            product_id: Product ID
            embedding: 1D numpy array
        """
        if self.embeddings is None or len(self.embeddings) == 0:
            self.embeddings = embedding.reshape(1, -1)
            self.product_ids = np.array([product_id])
        else:
            # Check if product already exists
            if product_id in self.product_ids:
                idx = np.where(self.product_ids == product_id)[0][0]
                self.embeddings[idx] = embedding
            else:
                self.embeddings = np.vstack([self.embeddings, embedding])
                self.product_ids = np.append(self.product_ids, product_id)
    
    def save_embeddings(self, embeddings_file: str, product_ids_file: str):
        """Save embeddings and product IDs to disk."""
        os.makedirs(os.path.dirname(embeddings_file) or ".", exist_ok=True)
        if self.embeddings is not None:
            np.save(embeddings_file, self.embeddings)
        if self.product_ids is not None:
            np.save(product_ids_file, self.product_ids)
