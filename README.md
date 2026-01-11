# 🧸 Toys & Co. - Digital Toy Shopping Platform

A modern web application prototype for browsing, searching, and reserving toys for children. Built with Angular and powered by an intelligent Rasa-based chatbot assistant.

## ✨ Key Features

### 🎯 Core Functionality
- **Product Catalog**: Browse a collection of 30 pre-loaded toys with detailed information
- **Advanced Search & Filtering**: Search toys by:
  - Name
  - Description
  - Type (puzzle, book, figure, character, etc.)
  - Age group
  - Target audience (boys, girls, all)
  - Manufacturing date
  - Price range
  - User ratings and reviews

### 🤖 Conversational AI Assistant
- **Intelligent Chatbot**: Powered by Rasa NLU for natural language understanding
- **Context-Aware Dialogue**: Maintains conversation history for better interactions
- **Multi-Modal Search**: Find toys through natural conversation
- **Reservation Assistance**: Reserve toys directly through chat
- **Comprehensive Responses**: Provides summarized toy information with links to details

### 🛒 Shopping Experience
- **Shopping Cart**: Add multiple toys with quantity selection
- **Reservation Management**: Track reserved toys with status updates
- **User Reviews**: Rate and review toys after purchase
- **Status Tracking**: Monitor order status (Reserved, Arrived, Cancelled)

## 🏗️ Architecture

### Frontend (Angular)
```
src/
├── app/
│   ├── home/          # Main toy catalog page
│   ├── details/       # Individual toy details
│   ├── cart/          # Shopping cart
│   ├── user/          # User profile & reservations
│   ├── login/         # Authentication
│   └── signup/        # User registration
├── models/            # TypeScript data models
└── services/          # API and utility services
```

### Backend Integration
- **Rasa Chatbot**: NLU-powered conversational assistant
- **Real-time Updates**: Dynamic cart and reservation updates

### Chatbot (Rasa)
```
chatbot/
├── actions/           # Custom chatbot actions
├── data/
│   ├── nlu.yml       # Training data for intent recognition
│   ├── rules.yml     # Conversation rules
│   └── stories.yml   # Dialogue flows
├── models/           # Trained ML models
└── domain.yml        # Chatbot domain configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+ (for Rasa chatbot)
- npm or Bun package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/toy-store.git
cd toy-store
```

2. **Install frontend dependencies**
```bash
npm install
# or
bun install
```

3. **Install chatbot dependencies**
```bash
cd chatbot
pip install rasa
```

4. **Train the chatbot model**
```bash
cd chatbot
rasa train
```

### Running the Application

1. **Start the Angular development server**
```bash
ng serve
# or
bun run start
```
The application will be available at `http://localhost:4200`

2. **Start the Rasa chatbot server** (in a separate terminal)
```bash
cd chatbot
rasa run actions &
rasa run --enable-api --cors "*"
```

## 📱 Usage

### Browsing Toys
1. Navigate to the home page to view all available toys
2. Use filters to narrow down by age group, type, price, etc.
3. Click on any toy to view detailed information

### Using the Chatbot
1. Click the chatbot icon to activate the assistant
2. Ask questions in natural language:
   - "Show me puzzles for 5-year-olds"
   - "Find toys under 1000 RSD"
   - "I need a gift for a girl aged 3-6"
3. The chatbot will help you find and reserve toys

### Making Reservations
1. Select desired quantity on toy details page
2. Click "Add to Cart"
3. Review cart and complete reservation
4. Track status from user dashboard

## 🎨 Features in Detail

### Toy Model
Each toy contains:
- Name and description
- Type (puzzle, book, figure, etc.)
- Age group recommendation
- Target audience
- Manufacturing date
- Price
- Status (Reserved, Arrived, Cancelled)
- User ratings and reviews
- High-quality product images

### Chatbot Capabilities
- **Intent Recognition**: Understands user queries about toy features
- **Entity Extraction**: Identifies search criteria from natural language
- **Contextual Responses**: Maintains conversation context
- **Action Handling**: Executes searches, filters, and reservations
- **Multi-turn Dialogues**: Handles complex, multi-step conversations

## 🛠️ Technology Stack

### Frontend
- **Angular 19**: Modern web framework
- **TypeScript**: Type-safe development
- **Angular Material**: UI component library
- **CSS3**: Modern styling with gradients and animations

### Chatbot
- **Rasa 3.x**: Open-source conversational AI
- **Python**: Backend logic
- **NLU Pipeline**: Custom intent and entity recognition
- **Dialogue Management**: Rule-based and ML-based policies

### Additional Tools
- **Bun**: Package management
- **Git**: Version control

## 📊 Data Models

### Toy
```typescript
{
  id: number
  name: string
  description: string
  type: Type
  ageGroup: AgeGroup
  targetGroup: string
  manufacturingDate: Date
  price: number
  status: string
  rating: number[]
  imageUrl: string
}
```

### Reservation
```typescript
{
  id: number
  userId: number
  toyId: number
  quantity: number
  status: string
  totalPrice: number
  createdAt: Date
}
```

## 🎯 Project Context

This project was developed as a university assignment for the Human-Computer Interaction (ICR) course.

