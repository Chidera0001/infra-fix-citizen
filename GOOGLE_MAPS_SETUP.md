# Google Maps Integration Setup

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account
2. **Billing Enabled**: Google Maps API requires billing to be enabled (but has a generous free tier)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

## Step 2: Enable Required APIs

Enable these APIs in your Google Cloud project:

1. **Maps JavaScript API** - For displaying the map
2. **Places API** - For location search functionality
3. **Geocoding API** - For address conversion

### How to enable APIs:

1. Go to "APIs & Services" > "Library"
2. Search for each API and click "Enable"

## Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Secure Your API Key

1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain (e.g., `localhost:8081`, `yourdomain.com`)
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled (Maps JavaScript API, Places API, Geocoding API)

## Step 5: Configure Your Application

1. Create a `.env` file in your project root:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. Replace `your_actual_api_key_here` with the API key you generated

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the admin or citizen dashboard
3. The map should now display with Google Maps tiles

## Features Included

-   **Interactive Heat Map** for admin view showing issue density
-   **Individual Markers** for citizen view showing specific issues
-   **Click to Report** functionality for citizens
-   **Zoom Controls** for better navigation
-   **Info Windows** with detailed issue information
-   **Color-coded Markers** based on issue status and severity

## Cost Considerations

-   **Free Tier**: $200 monthly credit (approximately 28,000 map loads)
-   **Pricing**: After free tier, ~$7 per 1,000 map loads
-   **Monitoring**: Set up billing alerts in Google Cloud Console

## Troubleshooting

1. **Map not loading**: Check if API key is correct and APIs are enabled
2. **Billing errors**: Ensure billing is enabled for your project
3. **Domain restrictions**: Make sure your domain is added to API key restrictions
4. **Console errors**: Check browser console for detailed error messages

## Security Best Practices

1. **Restrict API Key**: Always restrict your API key to specific domains
2. **Monitor Usage**: Set up billing alerts to avoid unexpected charges
3. **Environment Variables**: Never commit API keys to version control
4. **HTTPS**: Use HTTPS in production for secure API calls
