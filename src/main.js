import React from 'react';
import ReactDOM from 'react-dom';
import Homepage from './containers/Homepage.js';




document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(Homepage),
    document.getElementById('mount')
  );
});