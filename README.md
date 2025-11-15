# AI Fitness Tracker

A Next.js fitness tracking app that uses Groq AI to calculate calories burned based on workout type and duration. Track your fitness journey with AI-powered calorie calculations and comprehensive workout history.

## Features

### 🤖 AI-Powered Calorie Calculation
- Uses Groq API (Llama 3.3 70B) to intelligently calculate calories burned
- Takes into account workout type, duration, and intensity
- Provides concise, accurate calorie estimates with brief explanations
- Highlights calories burned in a prominent display

### 📅 Workout Tracking
- **Date Selection** - Choose any date for your workout (defaults to today)
- **Workout Type Input** - Enter any workout type (Running, Yoga, Weightlifting, Cycling, etc.)
- **Duration Tracking** - Specify workout duration in minutes
- **Automatic Saving** - Workouts are automatically saved after calorie calculation

### 📊 Statistics Dashboard
- **Total Workouts** - See how many workouts you've completed
- **Total Calories** - Track cumulative calories burned across all workouts
- **Average Calories** - View your average calories burned per workout
- Color-coded stat cards for easy visualization

### 🔍 Search & Filter
- **Real-time Search** - Search through your workout history by workout type
- **Instant Filtering** - Results update as you type
- **Case-insensitive** - Find workouts regardless of capitalization

### 🗑️ Workout Management
- **Delete Workouts** - Remove individual workouts from your history
- **One-click Deletion** - Simple trash icon button on each workout card
- **Immediate Updates** - Changes reflect instantly in the UI and localStorage

### 💾 Data Persistence
- **Local Storage** - All data stored locally in your browser
- **Persistent Data** - Workouts survive page refreshes and browser restarts
- **No Backend Required** - Everything works client-side
- **Privacy First** - Your data never leaves your browser

### 🎨 User Interface
- **Modern Design** - Clean, gradient-based UI with Tailwind CSS
- **Responsive Layout** - Works on desktop and mobile devices
- **Intuitive Navigation** - Easy-to-use form and workout cards
- **Visual Feedback** - Loading states, error messages, and hover effects
- **Highlighted Results** - Calories displayed prominently in styled cards

### ⚡ Performance
- **Fast API Calls** - Quick responses from Groq's high-speed inference
- **Optimized Rendering** - Efficient React components
- **Client-Side Only** - No server-side processing needed for data storage

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Groq API key (get one free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EzzahShoukat/AIfitnessTracker.git
   cd AIfitnessTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   
   Get your API key from [Groq Console](https://console.groq.com/)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Add a Workout**
   - Select the date of your workout
   - Enter the workout type (e.g., "Running", "Yoga", "Weightlifting")
   - Enter the duration in minutes
   - Click "Calculate Calories"

2. **View Results**
   - See your calories burned highlighted in a prominent card
   - Read the AI's explanation of the calculation
   - Your workout is automatically saved

3. **Track Progress**
   - View statistics in the dashboard (total workouts, calories, averages)
   - Browse your workout history
   - Search for specific workouts
   - Delete workouts you no longer need

## Data Storage

All workout data is stored in your browser's localStorage:
- **Persistent** - Data survives page refreshes and browser restarts
- **Private** - Your data never leaves your device
- **Per-Browser** - Each browser maintains its own workout history
- **No Account Needed** - Start tracking immediately

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI API**: Groq (Llama 3.3 70B Versatile)
- **Storage**: Browser localStorage
- **Package Manager**: npm

## Project Structure

```
fitnesstracker/
├── app/
│   ├── api/
│   │   └── calculate-calories/
│   │       └── route.ts          # Groq API integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main fitness tracker page
├── .env.local                    # Environment variables (not in git)
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is open source and available under the MIT License.

