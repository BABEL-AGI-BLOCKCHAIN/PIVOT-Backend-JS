# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

# Copy the entire application code to the container
COPY . .
# Expose the port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]
