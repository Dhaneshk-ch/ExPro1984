# 🤖 ML Service - Product Recommendations & Image Search

A FastAPI-based machine learning microservice that provides intelligent product recommendations and image-based search capabilities for the E-Commerce platform.

## 🎯 Features

- **Personalized Recommendations**: Content-based and history-based product recommendations
- **Similar Products**: Find products similar to a given product based on category and price
- **Image-Based Search**: Upload an image to find visually similar products using CNN embeddings
- **Health Monitoring**: Built-in health check endpoints
- **Scalable Architecture**: RESTful API design for easy integration

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **ML/Data**: scikit-learn, numpy, pandas
- **Computer Vision**: PyTorch, torchvision
- **Data Validation**: Pydantic 2.5.0
- **File Handling**: Pillow 10.1.0

## 📦 Installation

### Prerequisites
- Python 3.8+
- pip or conda
- Virtual environment (recommended)

### Setup Steps

1. **Create Virtual Environment**
```bash
cd ml-service
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Build Product Embeddings** (First time only)
```bash
python build_embeddings.py
```

This script:
- Loads all products from `data/products.json`
- Downloads product images (uses placeholders if downloads fail)
- Generates CNN embeddings using ResNet50
- Saves embeddings to `data/image_embeddings.npy`

4. **Start ML Service**
```bash
python app.py

# Or with Uvicorn directly
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The service will start at: **http://localhost:8000**

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "ML Service is running"
}
```

---

#### 2. User-Based Recommendations
```
POST /recommend/user
```

**Request:**
```json
{
  "userId": "user123",
  "user_history": [
    {
      "productId": "1",
      "category": "Electronics",
      "price": 3999
    },
    {
      "productId": "5",
      "category": "Clothing",
      "price": 2999
    }
  ],
  "top_k": 10
}
```

**Response:**
```json
[
  {
    "productId": "2",
    "name": "Smart Watch",
    "category": "Electronics",
    "price": 5999,
    "score": 0.92
  },
  {
    "productId": "3",
    "name": "USB-C Cable",
    "category": "Electronics",
    "price": 299,
    "score": 0.88
  }
]
```

**Logic**: 
- Analyzes user's purchase history (categories and price ranges)
- Recommends products in similar categories
- Excludes products already purchased
- Returns top-K highest similarity scores

---

#### 3. Similar Products
```
POST /recommend/similar-products
```

**Request:**
```json
{
  "productId": "1",
  "top_k": 10
}
```

**Response:**
```json
[
  {
    "productId": "2",
    "name": "Smart Watch",
    "category": "Electronics",
    "price": 5999,
    "similarity": 0.95
  },
  {
    "productId": "3",
    "name": "USB-C Cable",
    "category": "Electronics",
    "price": 299,
    "similarity": 0.82
  }
]
```

**Logic**:
- Finds products in the same category
- Considers price similarity
- Uses cosine similarity on feature vectors
- Returns products sorted by similarity score

---

#### 4. Image-Based Search
```
POST /image-search
```

**Request**: Multipart form data
```
file: <image_file>
top_k: 5 (optional, default: 5)
```

**Response:**
```json
[
  {
    "productId": "1",
    "similarity": 0.94
  },
  {
    "productId": "2",
    "similarity": 0.89
  }
]
```

**Logic**:
- Accepts image file (PNG, JPG, GIF, WebP)
- Generates CNN embedding using ResNet50
- Compares with stored product embeddings
- Returns top-K most similar products by cosine similarity

**Curl Example:**
```bash
curl -X POST "http://localhost:8000/image-search?top_k=5" \
  -F "file=@image.jpg"
```

---

#### 5. Product Count
```
GET /products/count
```

**Response:**
```json
{
  "count": 20
}
```

---

#### 6. Product Details
```
GET /products/{product_id}
```

**Response:**
```json
{
  "productId": "1",
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "category": "Electronics",
  "price": 3999,
  "imageUrl": "https://via.placeholder.com/300?text=Wireless+Headphones"
}
```

---

### Error Responses

**400 Bad Request**:
```json
{
  "detail": "Invalid image: File is not a valid image"
}
```

**404 Not Found**:
```json
{
  "detail": "Product not found"
}
```

**500 Internal Server Error**:
```json
{
  "detail": "Internal server error message"
}
```

## 🏗️ Project Structure

```
ml-service/
├── app.py                      # Main FastAPI application
├── models/
│   ├── recommender.py          # Recommendation engine
│   └── image_search.py         # Image-based search
├── data/
│   ├── products.json           # Product database
│   ├── image_embeddings.npy    # Pre-computed embeddings
│   └── product_ids.npy         # Product IDs mapping
├── utils/
│   └── text_processor.py       # Text processing utilities
├── build_embeddings.py         # Embedding generation script
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file if needed (optional):
```bash
ML_SERVICE_PORT=8000
ML_SERVICE_HOST=0.0.0.0
DEBUG=False
```

### Model Configuration

Edit `app.py` to modify:
- Image embedding dimensions (default: 2048 for ResNet50)
- Similarity thresholds
- Top-K defaults
- File size limits

## 📊 Data Flow

### Recommendation Flow
```
User History → Extract Categories & Prices → Create Feature Vectors → 
Compute Cosine Similarity → Sort & Return Top-K
```

### Image Search Flow
```
Upload Image → Resize & Normalize → ResNet50 Embedding → 
Cosine Similarity with Product Embeddings → Return Top-K
```

## 🚀 Performance Tips

1. **Cache Embeddings**: Pre-compute and cache all product embeddings
2. **Use GPU**: If available, PyTorch will automatically use GPU for faster inference
3. **Batch Processing**: The service handles concurrent requests via Uvicorn workers
4. **Monitor Logs**: Check console output for performance metrics

## 🔗 Integration with Node.js Backend

The ML service is called from the Node.js backend via REST API:

### Backend Service (`services/mlService.js`)
```javascript
const { getUserRecommendations } = require('../services/mlService');

// Get recommendations
const recommendations = await getUserRecommendations(userId, userHistory, 10);
```

### Backend Routes (`routes/mlRoutes.js`)
```javascript
GET  /ml/health
GET  /ml/recommendations/user
GET  /ml/recommendations/similar/:productId
POST /ml/image-search
GET  /ml/stats
```

## 🐛 Troubleshooting

### Issue: "Module not found" error
**Solution**: Ensure all requirements are installed
```bash
pip install -r requirements.txt
```

### Issue: "Image files not found"
**Solution**: The script uses placeholder images. This is normal. Real images can be added to `data/` folder.

### Issue: CUDA out of memory (GPU)
**Solution**: Reduce batch size or use CPU:
```python
# In image_search.py
self.device = torch.device("cpu")  # Force CPU
```

### Issue: Slow inference
**Solution**: 
1. Pre-build embeddings: `python build_embeddings.py`
2. Use GPU if available
3. Reduce image resolution

## 📈 Future Enhancements

- [ ] Real-time embedding updates
- [ ] Collaborative filtering
- [ ] User segmentation
- [ ] A/B testing framework
- [ ] Analytics dashboard
- [ ] Model retraining pipeline
- [ ] Multi-modal search (text + image)
- [ ] Cache layer (Redis)

## 📝 License

MIT License - Use freely for learning and commercial projects

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check backend `services/mlService.js` for integration details

---

**Last Updated**: December 6, 2025
**Status**: Production Ready
