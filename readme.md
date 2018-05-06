<p align="center">
	<img src="demo/images/brush.png" width="300">
	<br>
	<br>
</p>

> Add interactive backgrounds to your webpages - [View Demo](http://kamranahmed.info/brusher)

## Installation

```bash
yarn add brusher
```

## Usage

For the basic usage, all you need to do is create an instance of `Brusher` and provide an image

```javascript
import Brusher from 'brusher';

const brusher = new Brusher({
  image: 'abstract.png'
});

brusher.init();
```

## Available Options

Here is the list of options that you may use

```javascript
const brusher = new Brusher({
  image: 'abstract.png', // Path of the image to be used as a brush
  keepBlur: true, // Grow the cleared blurry section again after user has cleared it
  stroke: 80, // Stroke size for the brush
  lineStyle: 'round', // Brush style (round, square, butt)
  autoBlur: false, // Brusher will use the provided image for the blurry background
  autoBlurValue: 15, // Blur strength in pixels
});

brusher.init();
```

## License

MIT &copy; [Kamran Ahmed](https://twitter.com/kamranahmedse)
