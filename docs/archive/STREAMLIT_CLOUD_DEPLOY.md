# Deploying Strategic Pyramid Builder to Streamlit Cloud

**GitHub → Streamlit Cloud deployment guide (like Vercel!)**

If you're comfortable with Vercel's workflow, you'll love this - it's the exact same process!

---

## 🚀 Quick Deployment (5 minutes)

### Prerequisites

✅ GitHub account
✅ This repository pushed to GitHub (already done!)
✅ That's it!

---

## Step 1: Sign Up for Streamlit Community Cloud

1. Go to: **https://share.streamlit.io/**
2. Click **"Sign up"** (top right)
3. Choose **"Continue with GitHub"**
4. Authorize Streamlit to access your GitHub repos
5. Done! (It's free forever)

---

## Step 2: Deploy Your App

### From Streamlit Cloud Dashboard:

1. Click **"New app"** (big button)
2. Fill in the deployment form:

   **Repository:** `ashcroft79/Strategy`
   **Branch:** `main` (or your default branch)
   **Main file path:** `streamlit_app.py`

3. Click **"Deploy!"**

That's it! 🎉

### What Happens:

- Streamlit Cloud pulls your code from GitHub
- Installs dependencies from `requirements.txt` automatically
- Deploys your app
- Gives you a public URL like: `https://ashcroft79-strategy.streamlit.app/`

**Deployment takes 2-3 minutes the first time.**

---

## Step 3: Use Your App

Once deployed, you'll get a URL like:

```
https://ashcroft79-strategy.streamlit.app/
```

**Share this URL with anyone!** They can use the app in their browser - no installation needed!

---

## 🔄 Auto-Deploy (Just Like Vercel)

### Every time you push to GitHub:

```bash
git add .
git commit -m "Updated my pyramid builder"
git push origin main
```

**Streamlit Cloud automatically redeploys!** Just like Vercel!

You can watch the deployment in the Streamlit Cloud dashboard.

---

## 📊 Dashboard Features

In your Streamlit Cloud dashboard you can:

- ✅ **View logs** (see what's happening)
- ✅ **Manage settings** (environment variables, etc.)
- ✅ **See analytics** (how many people are using it)
- ✅ **Reboot app** (if needed)
- ✅ **Change branch** (deploy from different branch)
- ✅ **Custom domain** (advanced - like Vercel)

---

## 🎯 Complete Workflow (GitHub → Production)

### Your Workflow Will Be:

```bash
# 1. Make changes locally (optional - you can edit on GitHub too!)
git add .
git commit -m "Added new feature"
git push origin main

# 2. Streamlit Cloud auto-deploys
# 3. Check your live URL - changes are live!
```

**It's literally that simple.**

---

## 🔧 Configuration Files Needed

### We need ONE small file for cloud deployment:

**Create `.streamlit/config.toml` for production settings**

I'll create this for you - it tells Streamlit Cloud how to run the app.

---

## 💰 Pricing (All Free!)

**Streamlit Community Cloud is FREE and includes:**

- ✅ Unlimited public apps
- ✅ 1 private app
- ✅ Automatic SSL (HTTPS)
- ✅ GitHub integration
- ✅ Auto-deploy on push
- ✅ Community support

**Perfect for:**
- Personal projects
- Team tools
- Client demos
- Portfolio projects

---

## 🔐 Keeping It Private (Optional)

**By default, anyone with the URL can access your app.**

**To make it private:**

1. In Streamlit Cloud dashboard
2. Click your app settings
3. Click **"Sharing"**
4. Select **"Only people you invite"**
5. Add email addresses of people who can access it

---

## 🌐 Custom Domain (Optional)

**Want your own domain like `strategy.yourcompany.com`?**

1. Go to app settings in Streamlit Cloud
2. Click **"Custom domain"**
3. Follow instructions (like Vercel - add CNAME record)
4. Done!

---

## 🐛 Troubleshooting

### App Won't Deploy

**Check the logs:**
1. Click your app in dashboard
2. Click **"Manage app"** → **"Logs"**
3. See error messages

**Common issues:**

**Missing dependencies:**
- Solution: All dependencies are in `requirements.txt` - should work automatically

**Wrong file path:**
- Make sure you entered: `streamlit_app.py` (not `src/streamlit_app.py`)

**PYTHONPATH issues:**
- No need to set PYTHONPATH in cloud - it's automatic!

### App is Slow

**First deployment is slow (2-3 minutes).** After that, it's fast.

**If app is slow for users:**
- Free tier sleeps after inactivity
- First visit "wakes it up" (15-30 seconds)
- Subsequent visits are instant
- This is normal for free tier

**Upgrade to paid plan** ($20/month) for always-on apps.

### Can't Push to GitHub

**If you don't have write access to `ashcroft79/Strategy`:**

1. **Fork the repository** to your own GitHub account
2. Deploy from YOUR fork instead
3. Works exactly the same way!

---

## 📦 Files for Cloud Deployment

### 1. `.streamlit/config.toml` (Optional but recommended)

Create this file for production optimization:

```toml
[server]
headless = true
port = 8501
enableCORS = false
enableXsrfProtection = true

[browser]
gatherUsageStats = false
serverAddress = "0.0.0.0"

[theme]
primaryColor = "#1f77b4"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F0F2F6"
textColor = "#262730"
font = "sans serif"
```

### 2. `.gitignore` (Already exists)

Make sure these are ignored:

```
__pycache__/
*.pyc
.streamlit/secrets.toml
outputs/
temp_pyramid.json
```

### 3. `requirements.txt` (Already exists)

All dependencies are already listed - Streamlit Cloud reads this automatically!

---

## 🔄 GitHub → Streamlit Cloud → Production

### Full Process:

**One-time setup:**
1. ✅ Push code to GitHub (done!)
2. ✅ Sign up for Streamlit Cloud
3. ✅ Connect repository
4. ✅ Click Deploy

**Ongoing workflow:**
1. Edit code (locally or on GitHub)
2. Commit and push
3. **Automatic deployment!**
4. Share your URL

**That's it!** No build steps, no configuration, no server management.

---

## 💡 Pro Tips

### 1. Use Branches for Testing

```bash
# Create dev branch
git checkout -b dev

# Make changes, push
git push origin dev

# Deploy dev branch to Streamlit Cloud
# Test it at your dev URL
# When ready, merge to main
git checkout main
git merge dev
git push origin main
```

Streamlit Cloud can deploy multiple branches - just like Vercel!

### 2. Environment Secrets

**If you need API keys or secrets:**

1. Go to app settings in Streamlit Cloud
2. Click **"Secrets"**
3. Add your secrets (like Vercel environment variables)
4. Access in code:

```python
import streamlit as st
api_key = st.secrets["API_KEY"]
```

### 3. Monitor Usage

Check the **"Analytics"** tab in Streamlit Cloud to see:
- How many people are using your app
- Peak usage times
- Session duration

### 4. Collaborate

**Add team members:**
1. Go to app settings
2. Click **"Sharing"**
3. Invite people via email
4. They can view/use the app

---

## 🆚 Streamlit Cloud vs Vercel

| Feature | Streamlit Cloud | Vercel |
|---------|----------------|---------|
| **Workflow** | GitHub → Auto-deploy | GitHub → Auto-deploy |
| **Free Tier** | ✅ Generous | ✅ Generous |
| **Python Support** | ✅ Native | ⚠️ Limited |
| **WebSocket** | ✅ Built-in | ❌ Difficult |
| **Best For** | Data apps, dashboards | Static sites, APIs |
| **Our App** | ✅ **Perfect!** | ❌ Won't work |

**For Python/Streamlit apps, Streamlit Cloud IS the Vercel equivalent!**

---

## 🎓 Quick Tutorial: Deploy Your First App

### Let's do it together:

**1. Go to https://share.streamlit.io/**

**2. Sign in with GitHub**

**3. Click "New app"**

**4. Fill in:**
- Repository: `ashcroft79/Strategy`
- Branch: `main`
- Main file: `streamlit_app.py`

**5. Click "Deploy"**

**6. Wait 2-3 minutes**

**7. Your app is live!** 🎉

**8. Get your URL** (looks like: `https://ashcroft79-strategy.streamlit.app/`)

**9. Share it with your team!**

---

## 🔗 Helpful Links

**Streamlit Community Cloud:**
https://share.streamlit.io/

**Documentation:**
https://docs.streamlit.io/streamlit-community-cloud

**Deployment Guide:**
https://docs.streamlit.io/streamlit-community-cloud/get-started

**Community Forum:**
https://discuss.streamlit.io/

---

## ✅ Checklist

Before deploying:

- [ ] Code is pushed to GitHub
- [ ] `streamlit_app.py` is in root directory (it is!)
- [ ] `requirements.txt` exists (it does!)
- [ ] Signed up for Streamlit Community Cloud
- [ ] Repository connected
- [ ] Ready to deploy!

---

## 🎉 You're All Set!

**This is WAY easier than local installation!**

Benefits:
- ✅ No Python installation needed
- ✅ No dependency issues
- ✅ Works on any device with a browser
- ✅ Share with anyone via URL
- ✅ Auto-updates when you push to GitHub
- ✅ Free forever (for public apps)

**It's literally: Push → Deploy → Share**

Just like Vercel, but made for Python apps! 🚀

---

**Need help deploying? Let me know which step you're on and I'll guide you through it!**
