# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and lock file first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code and build
COPY . .
RUN npm run build

# Stage 2: Use Nginx to serve the built files and proxy API calls
FROM nginx:stable-alpine

# Copy our custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output to Nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
