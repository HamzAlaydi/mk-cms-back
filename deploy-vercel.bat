@echo off
echo 🚀 Deploying MK Group Backend to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing now...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please log in to Vercel...
    vercel login
)

REM Deploy to Vercel
echo 📦 Deploying to Vercel...
vercel --prod

echo ✅ Deployment completed!
echo 🌐 Your API is now live at the URL provided above
echo 📝 Don't forget to set up your environment variables in Vercel dashboard

pause
