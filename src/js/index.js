import '../styles/styles.scss';
import config from './config';
import { fadeInEffect, fadeOutEffect } from './utils/domUtils';


const { body } = document;
const spinner = document.querySelector('#spinner');

document.addEventListener('DOMContentLoaded', () => {
  fadeInEffect(body, 800);
  setTimeout(() => {
    fadeInEffect(spinner, 200);
  }, 100);
  setTimeout(() => {
    fadeOutEffect(spinner, 200);
  }, 2000);
});


config();