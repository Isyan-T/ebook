from flask import Flask, request, render_template, redirect, url_for
import os

app = Flask(_name_)
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder untuk menyimpan file
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Buat folder jika belum ada

@app.route('/')
def index():
    return render_template('upload file.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "Tidak ada file yang diunggah", 400

    file = request.files['file']
    if file.filename == '':
        return "Nama file kosong", 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)  # Simpan file ke folder
    return f"File berhasil diunggah: {file.filename}"

if _name_ == '_main_':
    app.run(debug=True)