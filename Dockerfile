# Use Node 18 or later
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching install step
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

# Build Next.js app
RUN npm run build

# Expose port that Next.js will listen on
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
