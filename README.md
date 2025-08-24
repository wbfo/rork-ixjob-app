# ixJOB - AI-Powered Career Assistant

A comprehensive mobile application built with React Native and Expo that helps users with job searching, resume building, interview preparation, and career development using AI assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Expo CLI
- PostgreSQL (for backend)
- iOS Simulator / Android Emulator / Physical device

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device:**
   - Scan QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

### Backend Setup

The app includes a full-featured backend API server for production use.

#### Automatic Setup (Recommended)

**On macOS/Linux:**
```bash
chmod +x setup-backend.sh
./setup-backend.sh
```

**On Windows:**
```bash
setup-backend.bat
```

#### Manual Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database:**
   ```bash
   createdb ixjob_dev
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start server:**
   ```bash
   npm run dev
   ```

## 📱 Mobile Device Testing

To test on your mobile device with the backend:

### 1. Find Your LAN IP

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig | findstr "IPv4"
```

### 2. Configure App

Update `app/.env`:
```env
EXPO_PUBLIC_API_BASE=http://192.168.1.100:3001
```

### 3. Configure Server CORS

Update `server/.env`:
```env
CORS_ORIGINS=http://localhost:19006,http://192.168.1.100:8081,exp://192.168.1.100:8081
```

### 4. Test Connection

Visit `http://YOUR_LAN_IP:3001/health` in your mobile browser to verify connectivity.

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **Framework:** React Native with Expo SDK 53
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Query + Context API
- **Styling:** StyleSheet with design tokens
- **UI Components:** Custom components with Lucide icons
- **Internationalization:** i18next with multiple languages

### Backend (Node.js + Express)
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js with security middleware
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with refresh tokens
- **File Upload:** Multer with 10MB limit
- **Rate Limiting:** Express rate limiter
- **CORS:** Dynamic origin detection for development

## 🔧 Development Features

### Offline Development
The app works without a backend server using mock data, making it easy to develop UI components and flows.

### Hot Reloading
Both frontend and backend support hot reloading for rapid development.

### Type Safety
Full TypeScript support with strict type checking across the entire codebase.

### Error Handling
Comprehensive error handling with user-friendly messages and detailed logging.

### Health Monitoring
Built-in health checks and monitoring endpoints for production deployment.

## 📊 API Endpoints

### Health & Monitoring
- `GET /health` - Comprehensive health check
- `GET /ready` - Readiness probe
- `GET /ping` - Simple connectivity test

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

### Core Features
- `/api/resumes` - Resume management
- `/api/jobs` - Job tracking
- `/api/interviews` - Interview preparation
- `/api/notes` - Note taking
- `/api/resources` - Learning resources

### AI Integration
- `/api/ai/chat` - AI chat assistant
- `/api/ai/image` - Image generation
- `/api/ai/transcribe` - Speech-to-text

## 🌐 Network Configuration

### Development
- Frontend: `http://localhost:19006` (web) / `exp://` (mobile)
- Backend: `http://localhost:3001`
- Auto-detection of LAN IP for mobile testing

### Production
- HTTPS required for production deployment
- Proper CORS configuration for your domain
- Environment-specific configuration

## 🔒 Security Features

- JWT authentication with refresh tokens
- Rate limiting (100 requests per 15 minutes)
- CORS protection with dynamic origins
- Helmet security headers
- Input validation with Zod schemas
- SQL injection protection with Prisma

## 🚀 Deployment

### Frontend (Expo)
```bash
# Build for production
expo build

# Or use EAS Build
eas build --platform all
```

### Backend (Node.js)
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Network Error Fix

If you see "🌐 Network Error: [object Object]" when starting the app:

**This is normal and expected behavior!** The app is designed to work in offline mode when the backend is not available.

**What happens:**
1. App tries to connect to backend server
2. If server is not running, it shows a brief network error
3. App automatically switches to offline mode
4. All features work with mock data

**To fix (optional):**
1. **For frontend-only development:** Ignore the error - the app works perfectly in offline mode
2. **To connect to backend:** Follow the backend setup instructions above

### Common Issues

**"Network error - check if server is running"**
- This is expected when backend is not running
- App automatically uses offline mode with mock data
- To enable backend: follow setup instructions above
- Verify backend server is running on correct port
- Check firewall settings
- Ensure mobile device is on same network as development machine

**"Database connection failed"**
- Verify PostgreSQL is running
- Check DATABASE_URL in server/.env
- Ensure database exists: `createdb ixjob_dev`

**"CORS blocked origin"**
- Add your device IP to CORS_ORIGINS in server/.env
- Restart backend server after CORS changes

**TypeScript errors**
- Run `npm run build` to check for type errors
- Ensure all dependencies are installed

### Debug Mode

Enable debug logging:
```bash
# Frontend
DEBUG=expo* npm start

# Backend
NODE_ENV=development npm run dev
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the backend setup documentation
3. Check server logs for detailed error messages
4. Ensure all environment variables are properly configured