
# Stage 1: Build the React frontend
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# Expose Vite port
EXPOSE 5173

# Start Vite server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
