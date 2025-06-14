# 🛠️ Kitaab Ghar – Backend

This is the backend for **Kitaab Ghar: The Next Generation Electronic Book Platform**, powering core functionalities such as user authentication, ebook management, and intelligent semantic search. It consists of two services:

- 🟢 **Node.js** – RESTful API for user and ebook operations
- 🧠 **FastAPI** – Semantic search and index generation engine using vector databases

---

## ⚙️ Backend Structure

```
Backend/
├── Express/                # Node.js Backend (user management, book storage, etc.)
├── FastApi/               # FastAPI service for semantic search
│   ├── main.py            # FastAPI entry point
│   ├── final_code.py      # Core semantic processing
│   ├── requirements.txt   # Python dependencies
│   ├── vector_dbs/        # Chroma vector databases
│   └── .env               # API keys and config
├── deploy.sh              # Deployment script
```

---

## 🚀 Features

### 🔧 Node.js API
- User authentication and account management
- Ebook upload and metadata management
- Purchase and download tracking
- Token/session handling

### 🤖 FastAPI AI Engine
- Embedding generation and indexing
- Semantic search across book content
- Integration with Chroma vector store
- FastAPI REST endpoints for search and indexing
- Stopword filtering and preprocessing

---

## 🧩 Tech Stack

- **Node.js** (Express, JWT, MongoDB or SQL)
- **FastAPI** (Python 3.10+, LangChain, Chroma, etc.)
- **Vector DB**: Chroma DB
- **Inter-service Communication**: HTTP (REST)
- **Shell Scripts**: For deployment and startup

---

## 🔄 Setup & Usage

### 1. Clone the Repository
```bash
git clone https://github.com/HamadS-IT/KitaabGhar.git
```

### 2. 📦 Express Backend
```bash
cd Backend/Express
npm install
npm run dev   # or npm start
```

### 2. 🧠 FastAPI Backend
```bash
cd Backend/FastApi
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📁 Environment Variables

### FastAPI (create `FastApi/.env`)
```
OPENAI_API_KEY=your_openai_key
CHROMA_DB_DIR=./vector_dbs/
```

### Express (create `Express/.env`)
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
R2_ENDPOINT=your_r2_endpoint
R2_ENDPOINT_V2=your_r2_endpint_v2
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
PORT=3000
```

---

## 📄 License

MIT License
