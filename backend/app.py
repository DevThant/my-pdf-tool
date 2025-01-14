import os
import io
from datetime import datetime
from flask import Flask, request, send_file, jsonify
import fitz  # PyMuPDF
from PIL import Image

app = Flask(__name__)

# Ensure an output folder exists
OUTPUT_FOLDER = "output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route('/merge', methods=['POST'])
def merge_pdf():
    """
    Expects multiple uploaded files in 'files' form field (PDF or image).
    Merges them in the provided order into one PDF.
    Returns the merged PDF as a downloadable file response.
    """
    # try:
    # Check if files are present
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400

    files = request.files.getlist('files')

    # If fewer than 2 files, return error
    if len(files) < 2:
        return jsonify({"error": "At least two files are required to merge"}), 400

    # Create an empty PDF in memory to merge everything
    merged_pdf = fitz.open()

    for file in files:
        filename = file.filename.lower()

        # Read the file bytes into memory
        file_bytes = file.read()

        if filename.endswith('.pdf'):
            # It's a PDF, open directly with fitz
            temp_pdf = fitz.open(stream=file_bytes, filetype="pdf")
            merged_pdf.insert_pdf(temp_pdf)
            temp_pdf.close()
        else:
            # Assume it's an image; we convert to an A4-sized PDF page
            img = Image.open(io.BytesIO(file_bytes))

            # Prepare a new, empty PDF
            temp_pdf = fitz.open()
            a4_width, a4_height = fitz.paper_size("a4")

            # Calculate scale to fit the image while preserving aspect ratio
            image_ratio = img.width / img.height
            a4_ratio = a4_width / a4_height

            if image_ratio > a4_ratio:
                # Image is wider than A4
                new_width = a4_width
                new_height = a4_width / image_ratio
            else:
                # Image is taller than A4
                new_height = a4_height
                new_width = a4_height * image_ratio

            # Center the image on the A4 page
            x_offset = (a4_width - new_width) / 2
            y_offset = (a4_height - new_height) / 2
            rect = fitz.Rect(x_offset, y_offset,
                                x_offset + new_width,
                                y_offset + new_height)

            # Create a blank A4 page and insert the image
            page = temp_pdf.new_page(width=a4_width, height=a4_height)
            page.insert_image(rect, stream=file_bytes)

            # Now merge this single-page PDF into the main merged PDF
            merged_pdf.insert_pdf(temp_pdf)
            temp_pdf.close()

    # Create an in-memory buffer to save the merged result
    merged_bytes = io.BytesIO()
    merged_pdf.save(merged_bytes)
    merged_pdf.close()
    merged_bytes.seek(0)

    # Return the merged PDF file as response
    # We'll name it "merged_<today_date>.pdf"
    today_date = datetime.now().strftime("%Y-%m-%d")
    download_filename = f"merged_{today_date}.pdf"

    return send_file(
        merged_bytes,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=download_filename
    )
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500


@app.route('/unlock', methods=['POST'])
def unlock_pdf():
    """
    Expects a single uploaded PDF in 'file' form field,
    and a 'password' field in the form data.
    Tries to unlock the PDF and returns the unlocked version.
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        if 'password' not in request.form or not request.form['password']:
            return jsonify({"error": "No password provided"}), 400

        pdf_file = request.files['file']
        password = request.form['password']

        # Read PDF into memory
        pdf_bytes = pdf_file.read()

        # Open with fitz, attempt authentication
        locked_pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

        if locked_pdf.needs_pass:
            success = locked_pdf.authenticate(password)
            if not success:
                return jsonify({"error": "Incorrect password"}), 401

        # Save an unlocked copy to memory
        unlocked_bytes = io.BytesIO()
        locked_pdf.save(unlocked_bytes)
        locked_pdf.close()
        unlocked_bytes.seek(0)

        # Return the unlocked PDF
        today_date = datetime.now().strftime("%Y-%m-%d")
        download_filename = f"unlocked_{today_date}.pdf"

        return send_file(
            unlocked_bytes,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=download_filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check route."""
    return jsonify({"status": "ok"}), 200


if __name__ == '__main__':
    # For local debugging (not used inside Docker usually),
    # we can run: python app.py
    app.run(host='0.0.0.0', port=5000, debug=True)
