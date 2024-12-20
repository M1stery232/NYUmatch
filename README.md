# NYU Match

NYU Match is a web application designed to help NYU students connect with each other based on their interests, personality types, and preferences. The platform facilitates meaningful connections within the NYU community by matching students who are either similar to or different from each other, depending on their preference.

## Features

- **Google Authentication**: Secure login using NYU email addresses
- **Personalized Profiles**: Students can create profiles with information about their:
  - Major
  - Residency
  - Gender
  - Social Goals
  - Personality Type
  - Nationality
  - Personal Description
- **Smart Matching**: Two matching algorithms:
  - Match with similar students
  - Match with different students
- **AI-Powered Explanations**: Each match comes with a personalized explanation of why users were matched
- **Match Management**: Users can unmatch and find new connections

## Technology Stack

### Frontend
- React.js
- React Router
- Axios for API calls
- Firebase Authentication
- CSS for styling

### Backend
- Python Flask
- MongoDB
- Firebase Admin SDK
- OpenAI API for match explanations
- WebSocket support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository


2. Install frontend dependencies

3. Install backend dependencies


4. Set up environment variables:

Create a `.env` file in the backend/matching-job directory with:

start backendd and frontend server
bash
cd nyumatch-web
npm start
