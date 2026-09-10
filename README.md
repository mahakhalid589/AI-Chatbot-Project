# AI Lawyer Chatbot

An AI-powered bilingual legal assistance chatbot designed to provide general legal guidance based on Pakistani laws. The system uses Retrieval-Augmented Generation (RAG) to retrieve relevant legal information and generate focused responses in English and Urdu/Roman Urdu.

## Project Overview

**AI Lawyer Chatbot** is a Final Year Project (FYP) developed to make Pakistani legal information easier to access and understand through an AI-based conversational interface.

The system is designed to help users find general information related to Pakistani laws without requiring them to search through lengthy legal documents manually.

> **Note:** This chatbot provides general educational information and is not a replacement for professional legal advice from a qualified lawyer.

## Key Features

* AI-powered legal question answering
* Focused on Pakistani laws
* Bilingual support for English and Urdu/Roman Urdu
* Retrieval-Augmented Generation (RAG)
* Legal information retrieval from a law database
* Support for document-related assistance
* Voice input support
* Legal disclaimer for responsible use
* Conversational chatbot interface
* Confidence-based response indication

## Technologies Used

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Python
* Flask
* Flask-SocketIO

### AI and NLP

* LLaMA 3.1
* Retrieval-Augmented Generation (RAG)
* Sentence Transformers
* Multilingual NLP processing

### Database and Retrieval

* ChromaDB
* Vector embeddings
* Legal document retrieval

### Other Tools

* Git and GitHub
* VS Code
* Whisper-based voice processing

## How It Works

The chatbot follows a Retrieval-Augmented Generation approach:

1. The user enters a legal question.
2. The system processes the query.
3. Relevant legal information is retrieved from the legal knowledge base.
4. The retrieved information is provided to the AI model as context.
5. The system generates a focused response.
6. A confidence indication and legal disclaimer are provided with the response.

## Legal Domains

The project is intended to support general legal information related to areas such as:

* Criminal law
* Civil law
* Family law
* Property law
* Labour law

The knowledge base includes Pakistani legal material such as the Pakistan Penal Code and other relevant laws.

## Supported Languages

* English
* Urdu
* Roman Urdu

## Project Structure

```text
AI-Chatbot-Project/
│
├── components/          # Frontend components
├── data/                # Legal data and resources
├── hooks/               # Frontend hooks
├── lib/                 # Frontend utilities
├── pages/               # Application pages
├── vector_db/           # Vector database resources
│
├── App.tsx              # Main frontend application
├── App.css              # Application styling
├── main.tsx             # Frontend entry point
│
├── app.py               # Flask backend application
├── config.py            # Backend configuration
├── legal_retriever.py   # Legal information retrieval
├── document_processor.py
├── language_processor.py
├── voice_processor.py
│
├── requirements.txt     # Python dependencies
├── package.json         # Frontend dependencies
└── README.md            # Project documentation
```
## Project Setup

### Backend

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
python app.py
```

The backend runs on:

```text
http://127.0.0.1:5000
```

### Frontend

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend can then be accessed through the local Vite development server.

## Project Objective

The main objective of this project is to provide an accessible AI-based platform for obtaining general information about Pakistani laws, particularly for users who may find traditional legal documents difficult to understand or access.

## Future Improvements

Potential future improvements include:

* Expanding the legal knowledge base
* Improving retrieval accuracy
* Adding more legal domains
* Improving Urdu and Roman Urdu understanding
* Enhancing document analysis capabilities
* Improving response evaluation and reliability
* Deploying the system for public access

## Disclaimer

This project is developed for **educational and research purposes**. The information provided by the chatbot should not be considered professional legal advice. Users should consult a qualified Pakistani lawyer for advice regarding specific legal matters.

## Final Year Project

- **Project:** AI Lawyer Chatbot
- **Domain:** Artificial Intelligence / Natural Language Processing
- **Application:** Legal Information and Guidance
- **Country Focus:** Pakistan

