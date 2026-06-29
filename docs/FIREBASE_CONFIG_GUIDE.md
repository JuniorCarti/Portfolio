# Firebase Configuration - Copy & Paste Guide

## Where to Find Your Firebase Config

1. Visit: https://console.firebase.google.com/
2. Select your project
3. Click **Settings ⚙️** (gear icon, top-left)
4. Go to **"Your apps"** section
5. Click the **Web app** icon (looks like `</>`)
6. You'll see your config - **copy the entire code block**

## Your Firebase Config Will Look Like This

```javascript
// This is what Firebase gives you - EXAMPLE VALUES
const firebaseConfig = {
  apiKey: "AIzaSyDf0wDKd2Y4N1-2a_3bC4dE5fG6hI7jK8lM9N",
  authDomain: "my-portfolio-project.firebaseapp.com",
  projectId: "my-portfolio-project",
  storageBucket: "my-portfolio-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef0123456789"
};
```

## Where to Paste It in Your Portfolio

**File**: `js/script.js`

**Find this section (around line 285-290):**

```javascript
    // ============================================
    // FIREBASE REVIEWS INTEGRATION
    // ============================================

    // Initialize Firebase Configuration
    // TODO: Replace these values with your Firebase project credentials
    // Get these from Firebase Console: Project Settings > Service Accounts > Web SDK
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
```

## Replace With Your Real Config

**Delete the placeholder version above and replace with:**

```javascript
    // ============================================
    // FIREBASE REVIEWS INTEGRATION
    // ============================================

    // Initialize Firebase Configuration
    // TODO: Replace these values with your Firebase project credentials
    // Get these from Firebase Console: Project Settings > Service Accounts > Web SDK
    const firebaseConfig = {
        apiKey: "AIzaSyDf0wDKd2Y4N1-2a_3bC4dE5fG6hI7jK8lM9N",
        authDomain: "my-portfolio-project.firebaseapp.com",
        projectId: "my-portfolio-project",
        storageBucket: "my-portfolio-project.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef0123456789"
    };
```

## Step-by-Step Replacement

### Step 1: Get Your Config from Firebase

Go to Firebase Console and copy your Web SDK config. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",  // Long string starting with AIzaSy
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",  // 12-digit number
  appId: "1:123...:web:abc..."
};
```

### Step 2: Open js/script.js

Use any text editor (VS Code, Notepad++, etc.)

### Step 3: Find the Placeholder Config

Search for: `"YOUR_API_KEY"`

You'll find the placeholder section around line 285

### Step 4: Copy & Paste Your Real Config

**Delete all 6 lines** of the placeholder config:
```javascript
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
```

**Paste your real values** (copy from Firebase):
```javascript
        apiKey: "AIzaSyDf0wDKd2Y4N1-2a_3bC4dE5fG6hI7jK8lM9N",
        authDomain: "my-portfolio-project.firebaseapp.com",
        projectId: "my-portfolio-project",
        storageBucket: "my-portfolio-project.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef0123456789"
```

### Step 5: Save the File

Save `js/script.js` and refresh your portfolio

## Example Configuration from Firebase Console

When you copy your config from Firebase, it will look similar to this:

```javascript
// Copy this entire block from Firebase
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq",
  authDomain: "ridge-portfolio-123.firebaseapp.com",
  projectId: "ridge-portfolio-123",
  storageBucket: "ridge-portfolio-123.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:f1e2d3c4b5a69878"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

**For your portfolio, you ONLY need the firebaseConfig object** (not the initializeApp code, we handle that):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq",
  authDomain: "ridge-portfolio-123.firebaseapp.com",
  projectId: "ridge-portfolio-123",
  storageBucket: "ridge-portfolio-123.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:f1e2d3c4b5a69878"
};
```

## Verifying Your Config is Correct

After replacing the config, check:

✅ **apiKey** - Should start with `AIzaSy`  
✅ **authDomain** - Should end with `.firebaseapp.com`  
✅ **projectId** - Should match your Firebase project name  
✅ **storageBucket** - Should end with `.appspot.com`  
✅ **messagingSenderId** - Should be all numbers  
✅ **appId** - Should have format `1:numbers:web:hex`  

## Test It's Working

1. Save `js/script.js`
2. Refresh your portfolio
3. Open browser console (F12)
4. Look for message: **✅ Firebase initialized successfully**
5. Try submitting a test review
6. Check Firebase Console → Firestore → reviews collection
7. Your review should appear there!

## Troubleshooting Config Issues

### "Firebase config not set"
- Check that you replaced ALL placeholder values
- Make sure no values start with `YOUR_`

### "Firebase initialization error"
- Copy the config exactly as shown in Firebase Console
- Make sure all quotes and commas are correct
- Check projectId matches your actual Firebase project

### Still not working?
- Refresh the page after saving
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for error messages (F12 → Console)
- Verify Firestore database was created
- Check security rules are published

## Security Note ⚠️

Your `apiKey` is public (it's meant to be). However:
- ✅ Your Firebase security rules protect the database
- ✅ Only approved reviews can be read
- ✅ Anyone can submit, but only with valid data

Never share:
- ❌ Your Firebase admin credentials
- ❌ Your service account JSON
- ❌ Private keys

The web config is safe to share publicly.

---

**Questions? See `FIREBASE_SETUP_GUIDE.md` for full documentation!** 📚
