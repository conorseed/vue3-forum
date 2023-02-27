module.exports = {
  root: true,
  env: {
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  rules: {
    'no-unused-vars': import.meta.env.MODE === 'production' ? 'error' : 'warn'
  }
}
