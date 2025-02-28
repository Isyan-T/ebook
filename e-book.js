// Handle file upload
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (file) {
        // Validasi tipe file
        const allowedTypes = ['pdf', 'epub', 'mobi'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            uploadStatus.textContent = 'Tipe file tidak didukung. Gunakan format PDF, EPUB, atau MOBI';
            uploadStatus.style.color = 'red';
            e.target.value = ''; // Reset input file
            return;
        }
        
        // Validasi ukuran file (maksimal 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB dalam bytes
        if (file.size > maxSize) {
            uploadStatus.textContent = 'Ukuran file terlalu besar. Maksimal 10MB';
            uploadStatus.style.color = 'red';
            e.target.value = '';
            return;
        }
        
        uploadStatus.textContent = `File ${file.name} berhasil diunggah`;
        uploadStatus.style.color = 'green';
        addFileToList(file);
    }
});

// Add file to list
function addFileToList(file) {
    const fileList = document.getElementById('fileList');
    if (!fileList) {
        console.error('Element dengan id "fileList" tidak ditemukan');
        return;
    }

    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    // Escape karakter khusus pada nama file
    const safeFileName = file.name.replace(/[&<>"']/g, function(m) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return map[m];
    });
    
    fileItem.innerHTML = `
        <span>${safeFileName}</span>
        <button class="download-btn" onclick="downloadFile('${safeFileName}')">Download</button>
    `;
    
    fileList.appendChild(fileItem);
}

// Download file function 
function downloadFile(fileName) {
    try {
        // Validasi nama file
        if (!fileName || typeof fileName !== 'string') {
            throw new Error('Nama file tidak valid');
        }

        // Buat URL untuk download
        const downloadUrl = `/download/${encodeURIComponent(fileName)}`;

        // Buat element anchor untuk download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;

        // Tambahkan ke document dan klik
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error saat mengunduh file:', error);
        alert('Gagal mengunduh file. Silakan coba lagi.');
    }
}

// Sample data for demonstration
const sampleBooks = [
    'Buku 1.pdf',
    'Buku 2.epub', 
    'Buku 3.pdf'
];

// Populate sample books
window.onload = function() {
    try {
        sampleBooks.forEach(book => {
            if (book && typeof book === 'string') {
                addFileToList({name: book});
            } else {
                console.error('Data buku tidak valid:', book);
            }
        });
    } catch (error) {
        console.error('Error saat memuat data buku:', error);
    }
}
