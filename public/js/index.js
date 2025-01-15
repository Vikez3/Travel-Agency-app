/* eslint-disable */
import '@babel/polyfill';
import { login, logout, signup } from './login';
import { reviewHandler } from './review';
import { displayMap } from './mapbox';
import { previewPhoto, updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const reviewForm = document.querySelector('.form--review');
const signupForm = document.querySelector('.form--sign-up');
const logOutBtns = document.querySelectorAll('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.querySelector('#book-tour');
const uloadPp = document.querySelector('.form__upload');

// VALUES

// DELEGATION

const hamburgerBtn = document.querySelector('.btn__hamburger');
const dropdown = document.querySelector('.dropdown');

hamburgerBtn.addEventListener('click', () => {
  dropdown.classList.toggle('visible');
});

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!hamburgerBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('visible');
  }
});

window.onload = function() {
  window.scrollTo(0, 0);
};

if (uloadPp) {
  uloadPp.addEventListener('change', previewPhoto);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });
}
if (reviewForm) {
  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const tour = document.getElementById('tour').value;
    const user = document.getElementById('user').value;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const slug = document.getElementById('slug').value;

    reviewHandler(tour, user, review, rating, slug);
  });
}
if (logOutBtns) {
  logOutBtns.forEach(btn => {
    btn.addEventListener('click', logout);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) showAlert('success', alertMessage, 5);
