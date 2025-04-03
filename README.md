# Prompt Swipe App

A TikTok-style app for browsing and interacting with AI prompts. Users can swipe up/down to navigate, double-click to like, and swipe right to send prompts to the DeepSeek model via Together AI.

## Features

- Swipe-based navigation for prompt browsing
- Integration with Together AI's DeepSeek model
- Real-time AI responses displayed in-app
- Like and share prompt functionality

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Together AI API key:
   - Sign up at [Together AI](https://together.ai/) if you haven't already
   - Get your API key from the Together AI dashboard
   - Create a `.env.local` file in the root of the project with:
     ```
     TOGETHER_API_KEY=your_together_ai_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

- **Swipe up/down**: Navigate between prompts
- **Double-click**: Like a prompt
- **Swipe right**: Send the prompt to DeepSeek model and view the response

## Technology Stack

- Next.js
- TypeScript
- Framer Motion for animations
- Together AI SDK for DeepSeek model integration
- Tailwind CSS for styling 