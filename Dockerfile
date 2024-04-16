# Use Node.js 14 LTS version as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code to the working directory
COPY . .

# Expose the port on which your app runs
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
