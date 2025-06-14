from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from pydantic import BaseModel
import shutil
import uuid
from pathlib import Path
import os
from final_code import main as process_pdf_index
import tempfile
import shutil
import tempfile




app = FastAPI()


# Configure CORS properly for your development environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Explicitly allow your frontend origin
    allow_credentials=True,  # Only if you're actually using cookies/auth
    allow_methods=["POST"],  # Be specific about allowed methods
    allow_headers=["Content-Type"],  # Be specific about allowed headers
    expose_headers=["*"]
)
load_dotenv()

UPLOAD_DIR = "uploads"
VECTOR_DB_DIR = "vector_dbs"


UPLOAD_DIREC = "processed_pdfs"
HTML_TEMPLATE_PATH = "templates/index_template.html"

def validate_environment():
    """Check if required directories and files exist"""
    if not os.path.exists(HTML_TEMPLATE_PATH):
        raise RuntimeError(f"Template file not found at {HTML_TEMPLATE_PATH}")
    
    # Ensure upload directory exists
    Path(UPLOAD_DIREC).mkdir(parents=True, exist_ok=True)


os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VECTOR_DB_DIR, exist_ok=True)



class IndexRequest(BaseModel):
    source_pdf_path: str
    # html_template_path: str

def get_answer_with_gpt(context, question):
    """Use GPT-4 via LangChain to generate an answer."""
    
    template = """
    You are a semantic search assistant. The following context has been retrieved from a book.
    Please answer the question as clearly and accurately as possible based on the provided context.
    If the context does not provide a direct answer, try to infer an approximate answer from the context.
    If no answer is available or inferred, return "Answer not found."

    Context: {context}
 
    Question: {question}

    Answer:
    """

    prompt = PromptTemplate(input_variables=["context", "question"], template=template)

    # Load the OpenAI chat model
    llm = ChatOpenAI(model="gpt-4", temperature=0)

    # Chain the prompt and model together
    chain = prompt | llm

    # Invoke the model
    result = chain.invoke({"context": context, "question": question})
    return result.content.strip()



# Configuration (should be in your settings/config)
UPLOAD_DIR = "uploads"  # Relative to your application root
TEMPLATE_DIR = "templates"  # Relative to your application root
INDEX_TEMPLATE = "index_template.html"  # Template filename

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    """Process PDF and add index"""
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    try:
        # Get absolute paths using Path for better cross-platform compatibility
        app_root = Path(__file__).parent  # Adjust based on your structure
        template_path = app_root / TEMPLATE_DIR / INDEX_TEMPLATE
        
        # Create temp directory
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_dir_path = Path(temp_dir)
            
            # Save uploaded file
            original_path = temp_dir_path / file.filename
            with open(original_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Process PDF
            processed_filename = f"processed_{file.filename}"
            processed_path = temp_dir_path / processed_filename
            
            # Use the resolved template path
            process_pdf_index(
                str(original_path),
                str(template_path),
                str(processed_path)
            )
            
            # Save processed file to upload directory
            final_path = Path(UPLOAD_DIR) / processed_filename
            shutil.copy(processed_path, final_path)
            
            return FileResponse(
                final_path,
                media_type="application/pdf",
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Expose-Headers": "*"
                }
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            headers={"Access-Control-Allow-Origin": "*"},
            detail=f"Processing failed: {str(e)}"
        )






@app.post("/vectorize")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Load PDF
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=500)
        docs = text_splitter.split_documents(documents)

        # Generate embeddings
        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

        # Generate a unique vector database name
        unique_db_name = f"book_{uuid.uuid4().hex}"
        vector_db_path = os.path.join(VECTOR_DB_DIR, unique_db_name)

        # Store embeddings in ChromaDB
        vectorstore = Chroma.from_documents(docs, embeddings, persist_directory=vector_db_path)

        return {
            "message": f"Embeddings stored successfully for {file.filename}",
            "vector_db_path": vector_db_path  # Return the vector DB path
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class QuestionRequest(BaseModel):
    question: str
    vectorDBPath: str  # Accept the vector store path dynamically

@app.post("/ask")
def ask_question(request: QuestionRequest):
    """API Endpoint to process the question and return an answer."""
    
    # Check if the vector database exists
    if not os.path.exists(request.vectorDBPath):
        raise HTTPException(status_code=500, detail="Vector database not found. Please create it first.")

    # Load the embeddings model
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    
    # Load the vectorstore from Chroma using the provided path
    vectorstore = Chroma(persist_directory=request.vectorDBPath, embedding_function=embeddings)

    # Perform semantic search in the vectorstore
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
    results = retriever.invoke(request.question)

    if results:
        # Combine relevant chunks
        context = "\n".join(result.page_content for result in results)
        metadata = ", ".join(sorted(set(str(result.metadata.get('page')) for result in results), key=int))

        # Generate an answer using GPT-4
        answer = get_answer_with_gpt(context, request.question)
        if answer.strip() == "Answer not found.":
            metadata = ""

        return {"answer": answer, "page_numbers": metadata}

    return {"answer": "Answer not found.", "page_numbers": ""}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=7000)
