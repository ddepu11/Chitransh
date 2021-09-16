import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBkTyUnQoZ1JVqLw19qxSYHfMJsDwIzqwg',
  authDomain: 'chitransh-7f1ec.firebaseapp.com',
  projectId: 'chitransh-7f1ec',
  storageBucket: 'chitransh-7f1ec.appspot.com',
  messagingSenderId: '142762159182',
  appId: '1:142762159182:web:9ad877095307bd5ed7671f',
};

const app = initializeApp(firebaseConfig);
const authInstance = getAuth();

export { authInstance };

export default app;
