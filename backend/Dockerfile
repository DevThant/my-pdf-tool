# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set a working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose port 5000 for Flask
EXPOSE 5000

# Run the Flask server
CMD ["python", "app.py"]
