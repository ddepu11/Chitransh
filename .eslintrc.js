module.exports = {
  parser: '@babel/eslint-parser',

  ignorePatterns: ['webpack'],

  extends: [
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
  ],

  env: {
    browser: true,
  },

  plugins: ['react', 'prettier', 'flowtype'],

  rules: {
    'react/react-in-jsx-scope': ['off'],
    'react/forbid-prop-types': ['warn', { forbid: ['any'] }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['ref', 'setTimeOutId'],
      },
    ],
  },
};
