# Strategic Pyramid Builder - Windows Installation Guide

**Complete step-by-step guide for Windows users (Command Prompt or PowerShell)**

## ✅ Step 1: Check if Python is Installed

### Open Command Prompt or PowerShell

**Command Prompt:**
1. Press `Windows key + R`
2. Type `cmd`
3. Press Enter

**PowerShell:**
1. Press `Windows key + X`
2. Click "Windows PowerShell" or "Terminal"

### Check Python Version

Type this command and press Enter:

```cmd
python --version
```

**What you should see:**
```
Python 3.9.x or Python 3.10.x or Python 3.11.x or Python 3.12.x
```

### ❌ If Python is NOT Installed

1. Go to https://www.python.org/downloads/
2. Download "Python 3.11" (recommended)
3. **IMPORTANT:** During installation, check the box "Add Python to PATH"
4. Click "Install Now"
5. Close and reopen Command Prompt/PowerShell
6. Try `python --version` again

---

## 📥 Step 2: Get the Code

### If you have the code already:

1. Open Command Prompt or PowerShell
2. Navigate to the Strategy folder:

```cmd
cd C:\Users\YourUsername\Downloads\Strategy
```

Replace `YourUsername` with your actual Windows username.

**Tip:** You can drag and drop the folder into Command Prompt to get the path automatically!

### If you need to download from GitHub:

```cmd
git clone https://github.com/ashcroft79/Strategy.git
cd Strategy
```

---

## 📦 Step 3: Install Dependencies

**You're now in the Strategy folder.** Run this command:

```cmd
pip install streamlit plotly pydantic python-dateutil click rich
```

**This will take 1-2 minutes.** You'll see lots of text scrolling - that's normal!

**What it's doing:**
- Installing Streamlit (web interface)
- Installing Plotly (charts)
- Installing other required libraries

### ✅ Verify Installation

Type:

```cmd
streamlit --version
```

You should see something like: `Streamlit, version 1.28.0`

---

## 🚀 Step 4: Launch the Web App

### Method 1: Using the PowerShell Script (Recommended)

**In PowerShell only** (not Command Prompt):

```powershell
# First time only - allow scripts to run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Launch the app
.\run_web_app.sh
```

### Method 2: Manual Launch (Works in both CMD and PowerShell)

**Command Prompt:**

```cmd
set PYTHONPATH=%PYTHONPATH%;%CD%\src
streamlit run streamlit_app.py
```

**PowerShell:**

```powershell
$env:PYTHONPATH="$env:PYTHONPATH;$(Get-Location)\src"
streamlit run streamlit_app.py
```

**Copy and paste the entire command, then press Enter!**

---

## 🌐 Step 5: Open the Web Interface

### The app will start and you'll see:

```
You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.x.x:8501
```

### One of two things will happen:

**Option A:** Your browser opens automatically ✅
- Great! Skip to Step 6

**Option B:** Browser doesn't open
1. Open your web browser (Chrome, Firefox, Edge)
2. Type in the address bar: `http://localhost:8501`
3. Press Enter

---

## 🎨 Step 6: Using the Web Interface

### You'll see the Strategic Pyramid Builder home page!

### Let's Try the Example First:

1. Look for the button **"📖 Load Example Pyramid"**
2. Click it
3. You'll see a complete example strategy appear!

### Explore the Example:

**Left sidebar navigation:**
- 🏠 Home - Dashboard overview
- 🔨 Build Pyramid - See all the content
- ✓ Validate - Run validation checks
- 📤 Export - Download as Markdown or JSON
- ℹ️ About - Learn more

**Try this:**
1. Click **"✓ Validate"** in the sidebar
2. Click the blue **"🔍 Run Validation"** button
3. See the validation results with charts!
4. Click **"📤 Export"** in the sidebar
5. Select **"Executive (1 page summary)"**
6. Click **"👁️ Preview"** to see the document
7. Click **"📥 Download"** to save it

---

## ✨ Step 7: Create Your Own Pyramid

### Start Fresh:

1. Click **"🏠 Home"** in the sidebar
2. If you loaded the example, click **"🔄 New Pyramid"** in the sidebar
3. Confirm you want to start new

### Fill in the Form:

1. **Project Name**: `My Strategy 2026`
2. **Organisation**: `Your Company Name`
3. **Your Name**: `Your Name`
4. **Description**: `Strategic pyramid for my team` (optional)
5. Click **"✨ Create New Pyramid"**

### Build Your Pyramid:

1. Click **"🔨 Build Pyramid"** in the sidebar
2. Click the **"1️⃣ Purpose"** tab
3. Fill in your vision statement
4. Click **"Save Vision"**
5. Add your values using the form at the bottom
6. Continue through the other tabs!

---

## 💾 Step 8: Save Your Work

### Auto-save:

The app saves your work in the browser while you're working.

### Download Your Pyramid:

**Option 1: Save as JSON**
1. Scroll to bottom of Build page
2. Click **"💾 Save Pyramid"**
3. Click **"📥 Download JSON"** button that appears
4. File saves to your Downloads folder!

**Option 2: Export as Document**
1. Click **"📤 Export"** in sidebar
2. Choose your audience (Executive, Leadership, etc.)
3. Click **"📥 Download"**
4. File saves to your Downloads folder!

---

## 🛑 How to Stop the App

### When you're done:

1. Go back to Command Prompt/PowerShell
2. Press `Ctrl + C`
3. Type `y` if asked, then press Enter

**The app will stop.**

---

## 🔄 How to Start Again Later

### Easy!

1. Open Command Prompt or PowerShell
2. Navigate to the Strategy folder:

```cmd
cd C:\Users\YourUsername\Downloads\Strategy
```

3. Run the launch command again:

**PowerShell:**
```powershell
$env:PYTHONPATH="$env:PYTHONPATH;$(Get-Location)\src"
streamlit run streamlit_app.py
```

**Command Prompt:**
```cmd
set PYTHONPATH=%PYTHONPATH%;%CD%\src
streamlit run streamlit_app.py
```

4. Open browser to `http://localhost:8501`

---

## 🆘 Troubleshooting

### Problem: "python is not recognized"

**Solution:**
- Python is not installed or not in PATH
- Reinstall Python from python.org
- **CHECK THE BOX:** "Add Python to PATH" during installation
- Restart Command Prompt

### Problem: "pip is not recognized"

**Solution:**
```cmd
python -m pip install streamlit plotly pydantic python-dateutil click rich
```

Use `python -m pip` instead of just `pip`

### Problem: "streamlit is not recognized"

**Solution:**
```cmd
python -m streamlit run streamlit_app.py
```

Use `python -m streamlit` instead of just `streamlit`

### Problem: Port 8501 is already in use

**Solution 1:** Stop the old app (Ctrl+C in the old terminal)

**Solution 2:** Use a different port:
```cmd
streamlit run streamlit_app.py --server.port 8502
```
Then open: `http://localhost:8502`

### Problem: Can't find Strategy folder

**Solution:**
```cmd
# List all folders to see where you are
dir

# Go up one level
cd ..

# Go to the right folder
cd Strategy
```

**Or:**
1. Open File Explorer
2. Navigate to your Strategy folder
3. Click in the address bar at the top
4. Copy the full path (e.g., `C:\Users\YourName\Downloads\Strategy`)
5. In Command Prompt: `cd [paste the path]`

### Problem: Browser shows "This site can't be reached"

**Solution:**
- Check if app is still running in Command Prompt
- Try `http://127.0.0.1:8501` instead of `localhost`
- Check Windows Firewall isn't blocking it

### Problem: Charts/visualizations not showing

**Solution:**
- Refresh the browser page (F5)
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser

---

## 📁 Where Are My Files?

### Downloaded Files:

Files you download go to: `C:\Users\YourUsername\Downloads\`

Look for files like:
- `my_strategy_executive.md`
- `my_strategy.json`

### Saved Pyramids:

When you click "Save" in the app, files are saved to:
```
C:\Users\YourUsername\Downloads\Strategy\outputs\
```

---

## 🎯 Quick Reference Card

### Start the app:
```cmd
cd C:\path\to\Strategy
set PYTHONPATH=%PYTHONPATH%;%CD%\src
streamlit run streamlit_app.py
```

### Stop the app:
```
Ctrl + C (in Command Prompt)
```

### Open the app:
```
http://localhost:8501
```

### Reinstall dependencies:
```cmd
pip install -r requirements.txt
```

---

## 💡 Pro Tips for Windows Users

### 1. Create a Desktop Shortcut

**Create a batch file** to launch easily:

1. Right-click on Desktop → New → Text Document
2. Name it: `Launch_Pyramid_Builder.bat`
3. Right-click → Edit
4. Paste this:

```batch
@echo off
cd C:\Users\YourUsername\Downloads\Strategy
set PYTHONPATH=%PYTHONPATH%;%CD%\src
start http://localhost:8501
streamlit run streamlit_app.py
pause
```

5. Replace `YourUsername` with your actual username
6. Save and close
7. Double-click the .bat file to launch!

### 2. Keep the Terminal Open

Don't close the Command Prompt/PowerShell window while using the app!
- The black window needs to stay open
- Minimize it if you want
- Only close it when done

### 3. Save Often

Click the "💾 Save Pyramid" button frequently to avoid losing work!

### 4. Use Chrome or Edge

The app works best in:
- Google Chrome
- Microsoft Edge
- Firefox

### 5. Full Screen Mode

Press `F11` in your browser for a cleaner view!

---

## 🎓 Tutorial: Your First Pyramid (5 minutes)

Let's build a simple pyramid together!

### Step 1: Start the App
```cmd
cd C:\path\to\Strategy
set PYTHONPATH=%PYTHONPATH%;%CD%\src
streamlit run streamlit_app.py
```

### Step 2: Create New Pyramid
- Click "Create New Pyramid"
- Project: "Test Strategy 2026"
- Organisation: "My Company"
- Your Name: "Your Name"
- Click "✨ Create New Pyramid"

### Step 3: Add Vision
- Click "🔨 Build Pyramid"
- Tab: "1️⃣ Purpose"
- Vision: "To be the best in our field"
- Click "Save Vision"

### Step 4: Add a Value
- Name: "Excellence"
- Description: "We strive for the highest quality"
- Click "➕ Add Value"

### Step 5: Add a Strategic Driver
- Click "2️⃣ Strategy" tab
- Sub-tab: "Tier 5: Strategic Drivers"
- Name: "Quality"
- Description: "Deliver exceptional quality in everything we do"
- Click "➕ Add Strategic Driver"

### Step 6: Validate
- Click "✓ Validate" in sidebar
- Click "🔍 Run Validation"
- See the results!

### Step 7: Export
- Click "📤 Export" in sidebar
- Choose "Executive (1 page summary)"
- Click "📥 Download"
- Open the file in your Downloads folder!

**Congratulations! You just built your first strategic pyramid!** 🎉

---

## 📞 Need More Help?

### Documentation:
- `README.md` - Main documentation
- `WEB_UI_GUIDE.md` - Detailed web UI guide
- `QUICKSTART.md` - Quick start guide

### Common Questions:

**Q: Do I need to be online?**
A: Only to install dependencies. After that, works offline!

**Q: Can I use this on multiple computers?**
A: Yes! Just copy the Strategy folder and install dependencies on each PC.

**Q: Can multiple people use it at the same time?**
A: No, it runs locally on your computer. Each person needs their own copy.

**Q: Is my data secure?**
A: Yes! Everything runs on YOUR computer. Nothing goes to the cloud.

**Q: Can I customize the tool?**
A: Yes! All code is included. Requires Python knowledge to modify.

---

## ✅ Checklist

Before you start, make sure you have:

- [ ] Python 3.9 or higher installed
- [ ] Python added to PATH
- [ ] Strategy folder downloaded
- [ ] Dependencies installed (`pip install streamlit ...`)
- [ ] Command Prompt or PowerShell open
- [ ] Navigated to Strategy folder (`cd C:\path\to\Strategy`)

Ready to launch? Run:
```cmd
set PYTHONPATH=%PYTHONPATH%;%CD%\src
streamlit run streamlit_app.py
```

Then open: http://localhost:8501

---

**Good luck building your strategic pyramid!** 🏛️

If you get stuck, try the Troubleshooting section above or review the Tutorial!
