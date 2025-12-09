"""
Text processing utilities for product data.
"""

import re
from typing import List


def normalize_text(text: str) -> str:
    """
    Normalize text by lowercasing and removing special characters.
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_keywords(text: str, min_length: int = 3) -> List[str]:
    """
    Extract keywords from text.
    """
    text = normalize_text(text)
    words = text.split()
    return [w for w in words if len(w) >= min_length]


def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts using Jaccard similarity.
    """
    keywords1 = set(extract_keywords(text1))
    keywords2 = set(extract_keywords(text2))
    
    if not keywords1 or not keywords2:
        return 0.0
    
    intersection = len(keywords1 & keywords2)
    union = len(keywords1 | keywords2)
    
    return intersection / union if union > 0 else 0.0
