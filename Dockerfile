# Use a small, official Node.js runtime
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (uses package-lock.json if present)
COPY package*.json ./
RUN npm install --production --silent

# Bundle app source
COPY . .

# Expose port and set production environment
ENV NODE_ENV=production
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
