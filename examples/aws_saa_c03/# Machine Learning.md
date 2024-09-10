# Machine Learning

## Amazon Comprehend

> *Amazon Comprehend is a natural-language processing (NLP) service that uses machine learning to uncover valuable insights and connections in text.*
>
- Natural Language Processing (**NLP**)
- Input = Document (conceptually text)
- Output = Entities, phrases, language, PII, sentiments
- Pre-trained models or custom
- Real-time analysis
- Async jobs for larger workloads
- Console & CLI, interactive, or use APIs to build into applications

## Amazon Kendra

> ***Amazon** **Kendra** is an intelligent search service powered by machine learning (ML).*
>
- **Intelligent search service**
- designed to **mimic** interacting with a **human expert**
- Supports wide range of question types
- **Factoid** - Who, what, where
- **Descriptive** - How do I get my cat to stop being a jerk?
- **Keyword** - What time is the keynote **address** (**address** can have multiple meaning) - Kendra helps determine **intent**

### Key Concepts

- **Index** - searchable data organized in an efficient way
- **Data Source** - Where your data lives, Kendra connects and indexes from this location
- S3, Confluence, Google Workspace, RDS, OneDrive, Salesforce, Kendra Web Crawler, Workdocs, FSx
- Synchronize with index based on a **schedule**
- **Documents** - Structured (FAQs), Unstructured (HTML, PDFs, text)
- Integrates with AWS Services (IAM, Identity Center (SSO), …)
-

## Amazon Lex

> ***Amazon** **Lex** is a fully managed artificial intelligence (AI) service with advanced natural language models to design, build, test, and deploy conversational interfaces in applications.*
>
- Backend-service
- Text or voice conversational interfaces
- Powers the Alexa voice
- Automatic speech recognition (**ASR**) - **speech to text**
- Natural Language Understanding (**NLU**) - **Intent**
- Build **understanding** into your **application**
- Scales, integrates, quick to deploy, Pay as you go pricing
- **Chatbots**, voice assistants, Q&A Bots, Info/Enterprise Bots

### Concepts

- Lex provides BOTS, conversing in 1+ languages
- **Intent** - an **action** the user wants to perform
- order a pizza, milkshake or fries
- samle utterances - ways in which an intent might be said “**can I order”** “I want to order” “Give me a”
- How to fulfil the intent - **lambda integration**
- Slot (parameters… e.g. Size small/medium/large, crust normal or cheesy)

## Amazon Polly

> *Amazon Polly is a service that turns text into lifelike speech, allowing you to create applications that talk, and build entirely new categories of speech-enabled products.*
>
- Converts **text** into “**life-like**” speech
- Text (language) → Speech (Language) NO translation
- Standard RRS = **Concatenative** (phonemes)
- Neutral TTS = **phonemes → spectrograms → vocoder → audio**
- MUCH more human/natural sounding but more complex
- Output formats - MP3, Ogg Vorbis, PCM
- Speech Synthesis Markup Language (**SSML**)
- additional control over **how** Polly generates speech
- **emphasis**
- **pronunciation**
- **whispering**
- **“newscaster”** speaking style

## Amazon Rekognition

> *Amazon Rekognition offers pre-trained and customizable computer vision (CV) capabilities to extract information and insights from your images and videos.*
>
- **Deep learning image and video analysis**
- Identify **objects, people, text, activities, content moderation, face detection, face analysis, face comparison, pathing** & much more
- **Per image** or **per minute** (video) pricing
- Integrates with applications & event-driven
- Can even **analyse live video** streams - kinesis video streams
-

## Amazon Textract

> *Amazon Textract is a machine learning (ML) service that automatically extracts text, handwriting, and data from scanned documents. It goes beyond simple optical character recognition (OCR) to identify, understand, and extract data from forms and tables*
>
- **Detect and analyze text** contained in **input documents**
- Input = **JPEG, PNG, PDF or TIFF**
- Output = **Extracted text, structure and analysis**
- Most documents = **Synchronous (real-time)**
- **Large documents** (big PDFs) = **Asynchronous**
- **Pay for usage -** custom pricing for large volume

### Use Cases

- Detection of text
- relationship between text
- metadata i.e. where text occurs
- Document analysis (names, address, birthdate)
- Receipt analysis (prices, vendor, lite items, dates)
- Identity documents (abstract fields… i.e DocumentID)

## Amazon Transcribe

> *Amazon Transcribe is an automatic speech recognition service that uses machine learning models to convert audio to text. You can use Amazon Transcribe as a standalone transcription service or to add speech-to-text capabilities to any application.*
>
- Automatic Speech Recognition (**ASR**) service
- Input = Audio, Output = Text
- **Language** customization, **Filters** for privacy, **audience-appropriate** language, **speaker** identification
- Custom **vocabularies** and **language models**
- Pay as you use - **per second** of transcribed audio

### Use Cases

- Full text **indexing** of audio - allow **searching**
- Meeting **notes**
- **Subtitle/captions & transcripts**
- Call **analytics** (characteristics, summarization, categories and sentiment)
- **Integration** with other apps / AWS **ML** services

## Amazon Translate

> *Amazon Translate is a neural machine translation service that delivers fast, high-quality, affordable, and customizable language translation.*
>
- **Text translation service** - ML based
- Translates text from **native language** to **other languages**  - one word at a time
- **Encoder reads source** → semantic representation (meaning)
- Decoder reads **meaning** → writes **target language**
- Attention mechanisms ensure **meaning** is translated
- **Auto detect** source text language

### Use Cases

- **Multilingual** user experience
- meeting notes, posts, communications, articles
- emails, in-game chat, customer **live chat**
- Translate **incoming data** (social media/news/communications)
- **Language-independence** for other AWS services
- comprehend, transcribe, polly, data stored in S3, RDS, DDB
- **Commonly integrates** with other services/apps/platforms

## Amazon Forecast

> *Amazon Forecast is a fully managed service that uses statistical and machine learning algorithms to deliver highly accurate time-series forecasts.*
>
- **Forecasting** for **time-series** data
- retail demand, supply chain, staffing, energy, server capacity, web traffic
- Import **historical & related data**
- understands what’s **normal**
- Output = **forecast** and forecast **explainability**
- Web Console (visualization), CLI, APIs, Python SDK

## Amazon Fraud Detector

> *Amazon Fraud Detector is a fully managed fraud detection service that automates the detection of potentially fraudulent activities online. These activities include unauthorized transactions and the creation of fake accounts. Amazon Fraud Detector works by using machine learning to analyze your data.*
>
- Fully managed **Fraud Detection** service
- new account creations, payments, guest checkout
- Upload **historical data**, choose **model type**
- **Online Fraud:** Little historical data e.g. new customer account
- **Transaction Fraud:** Transactional history, identifying suspect payments
- **Account Takeover:** Identify phishing or another social based attack
- Things are **scored - Rules/Decision** logic allow you to react to a score based on business activity

## Amazon SageMaker

> *Amazon SageMaker is a fully managed machine learning service. With SageMaker, data scientists and developers can quickly and easily build and train machine learning models, and then directly deploy them into a production-ready hosted environment.*
>
- Collection of ML services
- Fully managed ML service
- Fetch, Clean, Prepare, Train, Evaluate, Deploy, Monitor/Collect
- Sage Maker **Studio** - Build, train, debug and monitor models - IDE for ML lifecycle
- Sage Maker **Domain -** EFS Volume, Users, Apps, Policies, VPCs - isolation
- **Containers** - Docker containers deployed to ML EC2 instance - ML environments (OS, Libs, Tooling)
- **Hosting** - Deploy endpoints for your models
- SageMaker has no cost - the resources it create do
- **Complex pricing!**
