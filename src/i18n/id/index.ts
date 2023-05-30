import type { Translation } from '../i18n-types';

const id = {
  auth: {
    welcome: 'Selamat Datang Kembali',
    logoutUsername: 'Keluar {username|capitalize}',
    registerHere: 'Tidak punya akun? <>Daftar disini<>',
    notFound404: '404: Tidak Ditemukan',
    gone: 'Halaman Kosong',
    backTo: 'Kembali ke {isLoggedIn|{true: beranda, false: login}}',
  },
  home: {
    title: 'Aplikasi Svelte menggunakan:',
    sortBtn: 'Sortir Tombol',
    clock: 'Jam',
    toggleClock: 'Beralih Jam',
    clickToggleClock: 'Klik beralih jam untuk mengulang kalkulasi jam',
    changeLang: 'Ganti Bahasa',
    getStarted: 'Mulai',
  },
  forms: {
    username: 'Username',
    usernamePlaceholder: 'Username anda...',
    password: 'Password',
    passwordPlaceholder: 'Password anda...',
    error: '{icon} Error formulir',
    loginLoading: 'Sedang masuk...',
    login: 'Masuk',
    register: 'Daftar',
    add: 'Tambah {icon}',
    remove: 'Hapus {icon}',
    limit: 'Batas',
    todoPlaceholder: 'Apa yang akan anda lakukan selanjutnya...',
  },
  common: {
    list: 'Daftar {0}',
    error: '❌ {module} eror',
    noPageContent: 'Tidak Ada Konten',
    appName: 'Templat Svelte',
  },
  today: 'Hari ini {date|weekday}',
} satisfies Translation;

export default id;
