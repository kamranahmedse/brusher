import Brusher from '../../src';

const classMapping = {
  homepage: {
    image: 'images/homepage.jpg',
  },
  'default-demo': {
    image: 'images/default.jpg',
    stroke: 30,
  },
  'keep-cleared': {
    image: 'images/keep-cleared.jpg',
    stroke: 50,
    keepCleared: true,
  },
  'line-style': {
    image: 'images/line-style.jpg',
    stroke: 70,
    lineStyle: 'butt',
  },
};

function initHighlighter() {
  const codeElements = document.querySelectorAll('pre code');
  for (let counter = 0; counter < codeElements.length; counter++) {
    hljs.highlightBlock(codeElements[counter]); // eslint-disable-line
  }
}

function initBrusher() {
  const bodyClasses = document.body.classList;
  let options = classMapping.homepage;

  for (const currentClass in classMapping) {
    if (bodyClasses.contains(currentClass)) {
      options = classMapping[currentClass];
    }
  }

  const brusher = new Brusher(options);
  brusher.init();
}

initBrusher();
initHighlighter();
