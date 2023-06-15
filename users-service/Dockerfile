# Choose a base image
FROM node:19

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the app
CMD ["npm", "start"]