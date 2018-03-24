import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './Counter';

console.log("Hello world");
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(Counter),
    document.getElementById('mount')
  );
});