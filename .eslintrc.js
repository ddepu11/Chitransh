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
        ignorePropertyModificationsFor: ['ref', 'setTimeOutId', 'state'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-associated-control': ['off'],
    'no-else-return': ['off'],
    'react/jsx-boolean-value': ['off'],
  },
};
