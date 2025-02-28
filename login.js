// Fungsi untuk menangani proses login
async function handleLogin(event) {
    event.preventDefault();

    // Sesuaikan selector dengan form login yang ada di HTML
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Validasi input
        if (!email || !password) {
            throw new Error('Mohon isi email dan password');
        }

        // Validasi format email
        if (!isValidEmail(email)) {
            throw new Error('Format email tidak valid');
        }

        // Simulasi pengecekan login
        const isLoginValid = await checkLoginCredentials(email, password);

        if (isLoginValid) {
            // Login berhasil
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('email', email);
            
            // Tampilkan loading spinner
            document.getElementById('spinner').classList.add('show');
            
            // Redirect ke halaman utama setelah loading
            setTimeout(() => {
                window.location.href = 'utama.html';
            }, 1500);
            
        } else {
            throw new Error('Email atau password salah');
        }

    } catch (error) {
        alert(error.message);
        console.error('Login error:', error);
    }
}

// Fungsi untuk validasi email
function isValidEmail(email) {
    // Regex yang lebih ketat untuk validasi email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Hapus pesan error sebelumnya jika ada
    const existingError = document.querySelector('.email-error');
    if (existingError) {
        existingError.remove();
    }

    // Validasi email kosong
    if (!email) {
        showError('Email tidak boleh kosong');
        return false;
    }

    // Validasi panjang email
    if (email.length > 254) {
        showError('Email terlalu panjang');
        return false;
    }

    // Validasi format dengan regex
    if (!emailRegex.test(email)) {
        showError('Format email tidak valid');
        return false;
    }

    return true;

    // Fungsi helper untuk menampilkan error
    function showError(message) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'email-error';
        errorMsg.style.color = '#e08000';
        errorMsg.style.backgroundColor = 'rgba(254, 161, 22, 0.1)';
        errorMsg.style.padding = '10px';
        errorMsg.style.borderRadius = '8px'; 
        errorMsg.style.marginTop = '5px';
        errorMsg.style.fontSize = '14px';
        errorMsg.style.fontFamily = "'Poppins', sans-serif";
        errorMsg.textContent = message;

        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.parentNode) {
            emailInput.parentNode.appendChild(errorMsg);

            setTimeout(() => {
                errorMsg.remove();
            }, 3000);
        }
    }
}

// Fungsi simulasi pengecekan kredensial
function checkLoginCredentials(email, password) {
    return new Promise((resolve, reject) => {
        // Simulasi delay network request
        setTimeout(() => {
            try {
                // Validasi email dan password tidak boleh kosong
                if (!email || !password) {
                    throw new Error('Email dan password harus diisi');
                }

                // Validasi panjang password minimal 6 karakter
                if (password.length < 6) {
                    throw new Error('Password minimal 6 karakter');
                }

                // Contoh kredensial (ganti dengan validasi sebenarnya)
                const validEmail = 'admin@example.com';
                const validPassword = '123456';

                // Cek kredensial
                if (email === validEmail && password === validPassword) {
                    // Simpan token atau session
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);

                    resolve({
                        success: true,
                        message: 'Login berhasil!',
                        style: {
                            color: '#155724',
                            backgroundColor: '#d4edda',
                            border: '1px solid #c3e6cb',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            fontFamily: "'Poppins', sans-serif",
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    });
                } else {
                    throw new Error('Email atau password salah');
                }
            } catch (error) {
                // Hapus token/session jika login gagal
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');

                reject({
                    success: false,
                    message: error.message,
                    style: {
                        color: '#e08000',
                        backgroundColor: 'rgba(254, 161, 22, 0.1)', 
                        border: '1px solid #FEA116',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        fontFamily: "'Poppins', sans-serif",
                        boxShadow: '0 2px 4px rgba(254, 161, 22, 0.2)'
                    }
                });
            }
        }, 1000);
    });
}

// Tambahkan event listener untuk form login
const loginBox = document.querySelector('.login-box');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const result = await handleLogin(email, password);
        // Tampilkan pesan sukses
        showMessage(result.message, result.style);
        // Redirect ke halaman dashboard setelah login berhasil
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        // Tampilkan pesan error
        showMessage(error.message, error.style);
    }
});

function showMessage(message, style) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    Object.assign(messageDiv.style, style);
    loginBox.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}
// Tambahkan event listener untuk tombol register
const registerLink = document.querySelector('a[href="register.html"]') || document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'register.html';
    });
}

if (loginLink) {
    loginLink.onclick = () => {
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
            wrapper.classList.remove('active');
        }
    }
}

// Cek status login saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const registerLink = document.querySelector('a[href="register.html"]');
    const loginLink = document.querySelector('.login-link');

    if (registerLink) {
        registerLink.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        }
    }

    if (loginLink && wrapper) {
        loginLink.onclick = () => {
            wrapper.classList.remove('active');
        }
    }
});
