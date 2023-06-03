import type { BaseTranslation } from '../i18n-types';

const en = {
  auth: {
    welcome: 'Welcome Back',
    logoutUsername: 'Logout ({username:string})',
    registerHere: "Don't have an account? <>Register here<>",
    notFound404: '404: Not Found',
    gone: "It's gone",
    backTo: 'Go back to {isLoggedIn|{true: home, false: login}}',
  },
  home: {
    title: 'Svelte App using:',
    sortBtn: 'Sort Buttons',
    clock: 'Clock',
    toggleClock: 'Toggle Clock',
    clickToggleClock: 'Click toggle clock to restart the clock',
    changeLang: 'Change Language',
    getStarted: 'Get Started',
  },
  forms: {
    username: 'Username',
    usernamePlaceholder: 'Your username...',
    password: 'Password',
    passwordPlaceholder: 'Your password...',
    error: '{icon:string} Form error',
    loginLoading: 'Logging in...',
    login: 'Login',
    register: 'Register',
    add: 'Add {icon:string}',
    remove: 'Remove {icon:string}',
    limit: 'Limit',
    todoPlaceholder: 'What should you do next...',
  },
  common: {
    list: '{0:string} List',
    error: '❌ {module:string|capitalize} error',
    noPageContent: 'No Page Content',
    appName: 'Svelte Template',
    theme: 'Theme',
  },
  error: {
    minLength: '{field:string} must contain at least {length:number} characters',
    passwordMinLength: 'password must contain at least 6 characters',
  },
  today: 'Today is {date:Date|weekday}',
} satisfies BaseTranslation;

export default en;
