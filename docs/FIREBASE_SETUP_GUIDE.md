# Firebase Reviews Setup Guide

This guide will help you set up Firebase Firestore for the Reviews section on your portfolio.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or select an existing project
3. Follow the setup wizard to create your project
4. Choose to enable Google Analytics (optional)

## Step 2: Get Your Firebase Web Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click on the **Web app** icon (looks like `</>`)
4. Copy the entire `firebaseConfig` object
5. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 3: Add Config to Your Portfolio

1. Open `js/script.js` in your portfolio
2. Find the Firebase configuration section (around line 280-290)
3. Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // Replace with your API key
    authDomain: "YOUR_AUTH_DOMAIN",   // Replace with your auth domain
    projectId: "YOUR_PROJECT_ID",     // Replace with your project ID
    storageBucket: "YOUR_STORAGE_BUCKET",  // Replace with your storage bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
3. Choose location (closest to your users)
4. Select **"Start in production mode"**
5. Click **"Create"**

## Step 5: Set Up Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the default rules with this secure ruleset:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reviews collection - anyone can read approved reviews
    match /reviews/{document=**} {
      // Allow anyone to read approved reviews
      allow read: if resource.data.approved == true;
      
      // Allow anyone to create a review (submit form)
      allow create: if 
        request.auth.uid != null || request.resource.data.get('approved', false) == false;
      
      // Deny all other operations
      allow update, delete: if false;
    }
  }
}
```

3. Click **"Publish"**

**Security Features:**
- ✅ Only approved reviews are visible to users
- ✅ Anyone can submit a review (with basic throttling)
- ✅ Reviews are stored with `approved: false` by default
- ✅ No one can modify or delete reviews from the frontend

## Step 6: Manual Review Approval (Moderation)

Currently, all reviews are stored with `approved: false`. You need to manually approve them:

1. Go to Firestore Console
2. Open the `reviews` collection
3. Select each review document
4. Set `approved` field to `true`
5. The review will now appear on your portfolio

**Alternative: Auto-Approve Reviews (Not Recommended)**

If you want reviews to appear automatically (be cautious about spam):

1. In `js/script.js`, find the line:
```javascript
approved: false // Requires manual approval for security
```

2. Change to:
```javascript
approved: true  // Auto-approved (use at your own risk!)
```

## Step 7: Test the Reviews Feature

1. Refresh your portfolio page
2. Scroll to the **Reviews** section
3. Fill out the review form:
   - Enter your name
   - Select a rating
   - Write a review message
4. Click **"Submit Review"**
5. You should see: "Thank you! Your review has been submitted..."

## Step 8: Approve and View Reviews

1. Go to Firebase Console → Firestore → reviews collection
2. Find your test review (newest first)
3. Click the document to open it
4. Change `approved` from `false` to `true`
5. Save
6. Refresh your portfolio - your review should now appear!

## Firestore Database Structure

Your `reviews` collection will have documents like this:

```
Collection: reviews
├── Document ID (auto-generated)
│   ├── name: "John Doe" (string)
│   ├── rating: 5 (number: 1-5)
│   ├── message: "Great work!" (string)
│   ├── createdAt: Timestamp (server-generated)
│   └── approved: true (boolean)
```

## Quota & Pricing

**Free Tier (Spark Plan):**
- 50,000 read operations/day
- 20,000 write operations/day
- 20,000 delete operations/day
- Suitable for portfolios with moderate traffic

**Estimated Usage:**
- Each page load: 1 read operation (fetching reviews)
- Each review submission: 1 write operation
- Monthly: ~1,000 reads + 10-50 writes (typically free tier)

More info: [Firebase Pricing](https://firebase.google.com/pricing)

## Troubleshooting

### "Firebase config not set"
- Make sure you replaced all placeholder values in `firebaseConfig`
- Refresh the page and check browser console for errors

### "Reviews database initializing... Please refresh"
- This means Firestore needs to create an index
- Firebase creates indexes automatically the first time you query
- Wait 5-10 minutes and refresh the page

### "Unable to load reviews"
- Check your security rules (Step 5)
- Verify Firestore database is created
- Check browser console for specific error messages

### Reviews not appearing after submission
- Make sure you set `approved: true` in Firestore Console
- Check that `createdAt` field exists (server timestamp)
- Verify the review document is in the `reviews` collection

### Form submission not working
- Check browser console for JavaScript errors
- Make sure Firebase SDK loaded successfully
- Verify your API key is correct and has Firestore permissions

## Additional Security Considerations

### Rate Limiting
To prevent spam, consider adding rate limiting. You can implement:

1. **Client-side (basic):**
   - Disable form for 30 seconds after submission
   - Already partially implemented (disable button during submit)

2. **Server-side (recommended):**
   - Use Cloud Functions to rate-limit by IP/email
   - Set up Firebase Security Rules with rate limiting

### Content Moderation
For production, consider:

1. **Manual Moderation** (current setup)
   - You approve each review in Firebase Console
   - Best for small portfolios

2. **Automated Filtering**
   - Use Cloud Functions with content APIs
   - Block profanity and spam automatically

3. **Third-party Services**
   - Integrate with moderation services like Perspective API

## Next Steps

1. ✅ Follow the steps above to set up Firebase
2. ✅ Test with a sample review
3. ✅ Approve reviews in Firebase Console
4. ✅ Share your portfolio with others to collect reviews!

## Support

If you encounter issues:
1. Check the browser console (F12 → Console tab)
2. Review [Firebase Documentation](https://firebase.google.com/docs)
3. Check [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)

---

**Happy collecting reviews! 🚀**
