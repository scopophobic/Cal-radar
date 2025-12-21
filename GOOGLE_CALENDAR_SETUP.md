# Google Calendar Integration Setup

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain (if applicable)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development)
   - Copy the **Client ID**

## Step 2: Configure Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

**Important:** Never commit the `.env` file to git. It's already in `.gitignore`.

## Step 3: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Radar page
3. Click "Sign In" in the left sidebar (Google Calendar section)
4. Authorize the app to access your Google Calendar
5. Your calendar events should appear on the radar!

## Features

- **Automatic Sync**: When signed in, your Google Calendar events automatically sync to the radar
- **Multiple Calendars**: Supports multiple Google Calendars
- **Real-time Updates**: Events are fetched for the next 7 days
- **Category Detection**: Automatically categorizes events based on calendar name (work/personal)

## Troubleshooting

- **"Google Client ID not configured"**: Make sure your `.env` file exists and has the correct variable name
- **"Failed to sign in"**: Check that the Google Calendar API is enabled and your OAuth credentials are correct
- **Events not showing**: Verify you have events in your Google Calendar for the next 7 days

