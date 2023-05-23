# Use Node.js v18.14.0 as the base image
FROM node:18.14.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install the app's dependencies in container
RUN yarn install

# Copy the rest of the app's files to the container
COPY . .

# Expose port 5000 for the app
EXPOSE 5000

# Start the app
CMD ["yarn", "start"]

