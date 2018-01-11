import React, { Component } from 'react';
import './App.css';
import MyLightbox from './MyLightbox.js'

class App extends Component {

  render() {
    return (
      <div className="App">

        <MyLightbox images={LIGHTBOX_IMAGE_SET} />

      </div>
    );
  }
}

const LIGHTBOX_IMAGE_SET = [
  {
    src: 'https://dl.dropboxusercontent.com/s/g348ka7mt1qjzeu/DSCF6412.jpg?dl=0',
    caption: 'A forest',
    dimensions: [4141, 2761]
  },
  {
    src: 'https://dl.dropboxusercontent.com/s/bk8131mnc2zz7io/2013-05-24%2016.05.40.jpg?dl=0',
    caption: 'Hi',
    dimensions: [2448, 3264]
  },
  {
    src: 'https://dl.dropboxusercontent.com/s/uryo65lh3a6ejlk/DSCF5988.jpg?dl=0',
    caption: 'dasfsadfs',
    dimensions: [5646, 3764]
  }
];



export default App;
