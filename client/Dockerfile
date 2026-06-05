FROM node:20-alpine

WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy all client files
COPY . .

# Expose port
EXPOSE 3001

# Serve the application
CMD ["serve", "-s", ".", "-l", "3001"]
