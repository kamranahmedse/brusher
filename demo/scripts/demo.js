import Brusher from '../../src';

function initHighlighter() {
  const codeElements = document.querySelectorAll('pre code');
  for (let counter = 0; counter < codeElements.length; counter++) {
    hljs.highlightBlock(codeElements[counter]); // eslint-disable-line
  }
}

initHighlighter();

const brusher = new Brusher({
  image: 'images/original.jpg',
  skip: ['.panel-social'],
});

brusher.init();
