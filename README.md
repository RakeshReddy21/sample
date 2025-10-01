A real-time polling system built with React and Socket.io, designed for educational environments where teachers can create polls and students can participate in live voting sessions.

## 🚀 Features

### 👨‍🏫 Teacher Features
- **Create Polls**: Design custom polls with multiple choice questions
- **Live Results**: View real-time voting results as students submit answers
- **Timer Control**: Set poll duration (30, 60, or 90 seconds)
- **Answer Validation**: Mark correct answers for each option
- **Poll History**: View past poll results and statistics
- **Student Management**: Kick out disruptive students from sessions
- **Chat Integration**: Communicate with students via real-time chat

### 👨‍🎓 Student Features
- **Easy Registration**: Enter name to join polling sessions
- **Live Participation**: Submit answers to active polls
- **Real-time Results**: View live voting results after submission
- **Timer Awareness**: See countdown timer for each poll
- **Chat Access**: Communicate with teacher and other students
- **Session Management**: Handle kick-out scenarios gracefully

### 🔧 Technical Features
- **Real-time Updates**: Socket.io integration for live data synchronization
- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **Route Protection**: Secure access control for teacher and student areas
- **Session Management**: Persistent user sessions across browser tabs
- **Error Handling**: Comprehensive error handling and user feedback
- **Modern UI**: Clean, intuitive interface following modern design principles




## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sample
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=https://polling-system-server.onrender.com
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage Guide

### For Teachers
1. **Login**: Select "I'm a Teacher" on the home page
2. **Create Poll**: Enter question, add options, mark correct answers, set timer
3. **Monitor Results**: View live voting results as students participate
4. **Manage Students**: Use chat popup to kick out disruptive students
5. **View History**: Access past poll results and statistics

### For Students
1. **Join Session**: Select "I'm a Student" and enter your name
2. **Wait for Poll**: Wait for teacher to start a poll
3. **Submit Answer**: Select your answer and submit within the time limit
4. **View Results**: See live results after submission
5. **Chat**: Use chat feature to communicate with teacher and peers

## 🔧 Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3000`






### Build for Production
```bash
npm run build
```

