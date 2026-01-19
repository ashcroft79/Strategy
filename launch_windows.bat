@echo off
REM Strategic Pyramid Builder - Windows Launcher
REM
REM This batch file launches the web interface
REM Make sure you've installed dependencies first: pip install -r requirements.txt

echo.
echo ========================================
echo  Strategic Pyramid Builder
echo  Version 0.2.0 - Web Interface
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "streamlit_app.py" (
    echo ERROR: streamlit_app.py not found!
    echo Please run this script from the Strategy folder.
    echo.
    pause
    exit /b 1
)

REM Set Python path
set PYTHONPATH=%PYTHONPATH%;%CD%\src

echo [1/3] Setting up environment...
echo       PYTHONPATH configured
echo.

echo [2/3] Checking dependencies...
python -c "import streamlit" 2>nul
if errorlevel 1 (
    echo ERROR: Streamlit not installed!
    echo.
    echo Please run: pip install streamlit plotly pydantic python-dateutil click rich
    echo Or run: pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)
echo       Dependencies OK
echo.

echo [3/3] Launching web interface...
echo       Opening http://localhost:8501 in your browser...
echo.
echo ========================================
echo  App is running!
echo  Press Ctrl+C to stop
echo ========================================
echo.

REM Open browser after a short delay
start /b timeout /t 2 /nobreak >nul && start http://localhost:8501

REM Launch Streamlit
streamlit run streamlit_app.py --server.headless true --browser.gatherUsageStats false

REM If we get here, the app has stopped
echo.
echo ========================================
echo  App stopped
echo ========================================
echo.
pause
