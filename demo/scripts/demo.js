import Brusher from '../../src';

const brusher = new Brusher({
  image: 'images/original.jpg',
  skip: ['.header-container'],
});

brusher.init();
