# PDF Tools

A simple, efficient, and user-friendly web application for managing PDF files. With PDF Tools, you can easily merge multiple PDF files and decrypt password-protected PDFs.

## Features

- **Merge PDFs**: Combine multiple PDF files into a single document with customizable page order.
- **Unlock PDFs**: Remove password protection from PDF files by providing the correct passcode.

## Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/)

## Getting Started

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/DevThant/my-pdf-tool.git
```

### 2. Navigate to the Project Directory

```bash
cd my-pdf-tool
```

### 3. Build the Docker Image

```bash
docker-compose build
```

### 4. Start the Application

```bash
docker-compose up -d
```

### 5. Access the Application

Open your browser and visit:

```
http://localhost:3000/
```

## Usage

### Merge PDFs

1. Go to the **Merge** page.
2. Select multiple PDF files from your file explorer or drag and drop them into the upload area.
3. Rearrange the files by dragging and dropping them into your desired order.
4. Click the **Merge** button to combine the files into a single PDF.

### Unlock PDFs

1. Go to the **Unlock** page.
2. Upload the password-protected PDF file.
3. Enter the correct passcode.
4. If the passcode is valid, you can download the unlocked PDF without the passcode.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
