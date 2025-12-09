"""
Recommendation system using content-based and history-based approaches.
Recommends products based on category similarity and price ranges.
"""

import json
import os
from typing import List, Dict
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class ProductRecommender:
    def __init__(self, products_file: str = "data/products.json"):
        """Initialize recommender with product data."""
        self.products = self._load_products(products_file)
        self.product_dict = {p["productId"]: p for p in self.products}
        self.categories = self._get_categories()
        self.price_stats = self._calculate_price_stats()
    
    def _load_products(self, products_file: str) -> List[Dict]:
        """Load products from JSON file."""
        try:
            with open(products_file, 'r') as f:
                data = json.load(f)
                return data.get("products", [])
        except FileNotFoundError:
            print(f"Warning: {products_file} not found")
            return []
    
    def _get_categories(self) -> List[str]:
        """Extract unique categories from products."""
        return list(set(p["category"] for p in self.products))
    
    def _calculate_price_stats(self) -> Dict:
        """Calculate price statistics for normalization."""
        prices = [p["price"] for p in self.products]
        return {
            "min": min(prices) if prices else 0,
            "max": max(prices) if prices else 1,
            "mean": np.mean(prices) if prices else 0
        }
    
    def _create_feature_vector(self, product: Dict) -> np.ndarray:
        """
        Create a feature vector for a product.
        Features: [category_encoded, normalized_price]
        """
        category_idx = self.categories.index(product["category"])
        normalized_price = (product["price"] - self.price_stats["min"]) / (
            self.price_stats["max"] - self.price_stats["min"] + 1
        )
        
        # Create one-hot encoding for category
        category_vector = np.zeros(len(self.categories))
        category_vector[category_idx] = 1
        
        # Combine category and price
        return np.append(category_vector, normalized_price)
    
    def recommend_for_user(
        self, 
        user_history: List[Dict], 
        top_k: int = 10
    ) -> List[Dict]:
        """
        Recommend products based on user's purchase history.
        
        Args:
            user_history: List of purchased products with category and price
            top_k: Number of recommendations to return
            
        Returns:
            List of recommended products with scores
        """
        if not user_history:
            # Return top popular products (by price/availability)
            return [
                {
                    "productId": p["productId"],
                    "name": p["name"],
                    "category": p["category"],
                    "price": p["price"],
                    "score": 0.5
                }
                for p in self.products[:top_k]
            ]
        
        # Get products user has seen
        seen_ids = set(item.get("productId") for item in user_history)
        
        # Create feature vectors for user history
        history_vectors = []
        for item in user_history:
            product = self.product_dict.get(item.get("productId"))
            if product:
                history_vectors.append(self._create_feature_vector(product))
        
        if not history_vectors:
            return self.recommend_for_user([], top_k)
        
        # Average user profile
        user_profile = np.mean(history_vectors, axis=0)
        
        # Score all unseen products
        recommendations = []
        for product in self.products:
            if product["productId"] in seen_ids:
                continue
            
            product_vector = self._create_feature_vector(product)
            similarity = cosine_similarity(
                [user_profile], 
                [product_vector]
            )[0][0]
            
            recommendations.append({
                "productId": product["productId"],
                "name": product["name"],
                "category": product["category"],
                "price": product["price"],
                "score": float(similarity)
            })
        
        # Sort by score and return top k
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:top_k]
    
    def recommend_similar_products(
        self, 
        product_id: str, 
        top_k: int = 10
    ) -> List[Dict]:
        """
        Find products similar to the given product.
        
        Args:
            product_id: Product ID to find similar products for
            top_k: Number of recommendations to return
            
        Returns:
            List of similar products with similarity scores
        """
        target_product = self.product_dict.get(product_id)
        if not target_product:
            return []
        
        target_vector = self._create_feature_vector(target_product)
        
        # Score all other products
        similarities = []
        for product in self.products:
            if product["productId"] == product_id:
                continue
            
            product_vector = self._create_feature_vector(product)
            similarity = cosine_similarity(
                [target_vector], 
                [product_vector]
            )[0][0]
            
            similarities.append({
                "productId": product["productId"],
                "name": product["name"],
                "category": product["category"],
                "price": product["price"],
                "similarity": float(similarity)
            })
        
        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x["similarity"], reverse=True)
        return similarities[:top_k]
    
    def get_product(self, product_id: str) -> Dict:
        """Get product by ID."""
        return self.product_dict.get(product_id)
