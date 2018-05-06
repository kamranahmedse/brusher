![](https://i.imgur.com/Tq7TBnA.png)

> Little vanilla JS library to add interactive backgrounds to your webpages - [View Demo](http://kamranahmed.info/brusher)

## Installation

Install it using yarn or npm
```bash
yarn add brusher
```
Or you may use unpkg
```
http://unpkg.com/brusher/dist/brusher.min.js
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
  keepCleared: true,        // Put the blur back after user has cleared it
  stroke: 80,            // Stroke size for the brush
  lineStyle: 'round',    // Brush style (round, square, butt)
  autoBlur: false,       // Brusher will use the provided image for the blurry background
  autoBlurValue: 15,     // Blur strength in pixels
});

brusher.init();
```

A note on blurry background: although brusher is capable of generating blurry background by itself. It is recommended that you [blur the image yourself](http://pinetools.com/blur-image) and apply it to the body for improved performance. Brusher relies on CSS blur if you don't provide the blurry image. And rendering performance for the pre-provided blurred image would be of-cource much less than that applied using CSS. Here is the sample CSS that you may use for the background

```css
body {
  background-size: cover;
  background-position: 0 0;
  background-attachment: fixed;
  background-image: url(path/to/blurred/image.jpg);
}
```

## License

MIT &copy; [Kamran Ahmed](https://twitter.com/kamranahmedse)
