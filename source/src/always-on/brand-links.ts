export const publicSite = typeof window !== 'undefined' && ['127.0.0.1','localhost'].includes(window.location.hostname) ? '/public-website' : 'https://spreeai.github.io/public-website';
