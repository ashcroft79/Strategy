# Deployment Guide

This guide covers deploying both the FastAPI backend and Next.js frontend.

## Quick Start (Local Development)

### Terminal 1: Backend

```bash
# Install dependencies
pip install -r api/requirements.txt

# Run API server
python api/main.py
```

API will be available at `http://localhost:8000`

### Terminal 2: Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local if needed (defaults to http://localhost:8000)

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

This is the recommended setup for production.

#### Backend on Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python

3. **Configure Build**
   - **Build Command**: (Leave empty, Railway auto-detects)
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `/` (project root)

4. **Add Dependencies**
   - Railway will automatically install from `api/requirements.txt`
   - If needed, add `Procfile`:
     ```
     web: uvicorn api.main:app --host 0.0.0.0 --port $PORT
     ```

5. **Get Your API URL**
   - Once deployed, Railway provides a URL like: `https://your-app.up.railway.app`
   - Copy this URL for frontend configuration

#### Frontend on Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Repository**
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL`
   - Value: Your Railway API URL (e.g., `https://your-app.up.railway.app`)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://your-app.vercel.app`

6. **Update Backend CORS**
   - Edit `api/main.py` CORS configuration:
     ```python
     allow_origins=[
         "http://localhost:3000",
         "https://your-app.vercel.app",  # Add your Vercel URL
     ]
     ```
   - Commit and push changes
   - Railway will auto-redeploy

### Option 2: Render (All-in-One)

Deploy both services on Render.

#### Backend Service

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect your repository

2. **Configure**
   - **Name**: strategic-pyramid-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r api/requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free tier

3. **Deploy**
   - Render will provide a URL like: `https://strategic-pyramid-api.onrender.com`

#### Frontend Service

1. **Create Static Site or Web Service**
   - New → Static Site (or Web Service for SSR)
   - Connect same repository

2. **Configure**
   - **Name**: strategic-pyramid-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/.next` (if static) or use start command

3. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL` = your Render API URL

### Option 3: Docker Compose (Self-Hosted)

Perfect for VPS or on-premise deployment.

1. **Create `api/Dockerfile`**:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY api/requirements.txt /app/api/
RUN pip install --no-cache-dir -r api/requirements.txt

# Copy source code
COPY src/ /app/src/
COPY api/ /app/api/
COPY examples/ /app/examples/

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Create `frontend/Dockerfile`**:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
```

3. **Create `docker-compose.yml`**:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: api/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./examples:/app/examples
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - api
    restart: unless-stopped
```

4. **Create `nginx.conf`**:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream api {
        server api:8000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/ {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

5. **Deploy**:

```bash
docker-compose up -d
```

Access the app at `http://your-server-ip`

## Environment Variables

### Backend (api/)

No environment variables required for basic operation. All configuration is in `api/main.py`.

Optional:
- `PORT`: Server port (default: 8000)
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### Frontend (frontend/)

Required:
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Post-Deployment Checklist

- [ ] Backend API is accessible at its URL
- [ ] Frontend can connect to backend
- [ ] CORS is configured correctly
- [ ] Example pyramids load successfully
- [ ] Create/load pyramid works
- [ ] All exports generate correctly
- [ ] Validation runs without errors
- [ ] Mobile responsiveness verified
- [ ] HTTPS configured (production only)
- [ ] Error monitoring set up (optional)

## Monitoring & Logs

### Railway
- View logs in Railway dashboard
- Set up log drains for persistent logs

### Vercel
- View deployment logs in Vercel dashboard
- Use Vercel Analytics for performance monitoring

### Render
- View logs in Render dashboard
- Set up alerts for failures

### Docker
```bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart services
docker-compose restart
```

## Troubleshooting

### CORS Errors

**Symptom**: Frontend shows network errors, console shows CORS errors

**Fix**: Add your frontend URL to `api/main.py` CORS configuration:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app",
]
```

### API Not Found (404)

**Symptom**: Frontend can't reach API endpoints

**Fix**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check API is running and accessible
3. Ensure no trailing slash in API URL

### Build Failures

**Backend**:
- Check Python version (3.9+)
- Verify all dependencies in `requirements.txt`
- Check for import errors

**Frontend**:
- Check Node version (18+)
- Clear `.next` folder and rebuild
- Verify all dependencies installed

### Performance Issues

**Backend**:
- Use production ASGI server (uvicorn with workers)
- Enable response caching
- Consider database for large datasets

**Frontend**:
- Enable Next.js production optimizations
- Use CDN for static assets
- Implement lazy loading

## Scaling

### Horizontal Scaling

**Backend**:
```bash
# Railway: Adjust replicas in settings
# Docker: Scale with compose
docker-compose up -d --scale api=3
```

**Frontend**:
- Vercel auto-scales
- Docker: Scale web containers

### Database Migration

When ready to move from JSON to database:

1. Choose database (PostgreSQL recommended)
2. Create SQLAlchemy models from Pydantic models
3. Update PyramidManager to use database
4. Migrate existing JSON data
5. Update API endpoints

## Security

### Production Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS limited to specific domains
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies regularly updated
- [ ] Secrets not in version control

### Secrets Management

- Use platform-specific secrets (Vercel/Railway secrets)
- Never commit `.env` files
- Rotate credentials regularly

## Support

For issues or questions:
1. Check this deployment guide
2. Review MIGRATION_GUIDE.md
3. Check application logs
4. Review GitHub issues
5. Open new issue with details

## Cost Estimates

### Free Tier (Getting Started)
- Railway: Free tier available
- Vercel: Free for personal projects
- Render: Free tier with limitations

**Total: $0/month**

### Production (Recommended)
- Railway Hobby: $5/month
- Vercel Pro: $20/month
- **Total: ~$25/month**

### Enterprise
- Custom pricing based on usage
- Consider AWS/GCP/Azure for full control
