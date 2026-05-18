const express = require('express');
const app = express();


const APP_ID = 'bandmate_student_project'; // could not et real API key, so using a placeholder

async function loadEvents() {
  const input = document.getElementById('artist-input');
  const list = document.getElementById('events-list');
  const status = document.getElementById('events-status');

  // ff no events page elements exist, stop here
  if (!list) return;

  const artistName = input.value.trim();

  // don't run if the search box is empty
  if (!artistName) {
    status.textContent = 'Please enter an artist name.';
    return;
  };}

