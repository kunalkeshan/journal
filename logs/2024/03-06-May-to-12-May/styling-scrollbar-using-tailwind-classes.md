## Styling Scrollbar with Tailwind Classes

Right now the tailwind libarary doesn't have any class name supports for styling scrollbars, there is a plugin that I came across however. 

`tailwind-scrollbar` - https://www.npmjs.com/package/tailwind-scrollbar. Intall it and add it to your `tailwind.config.js` plugins and you can style the width, and the color of the track, thumb and corner.

Before using it, it's better to understand the anatomy of a scrollbar and how to style it - check this out for more information - https://developer.chrome.com/docs/css-ui/scrollbar-styling.

Intall - `npm install --save-dev tailwind-scrollbar`

Use it in your tailwind plugins

```js
module.exports = {
    // other configuration...
    plugins: [
        // other plugins...
        require('tailwind-scrollbar'),
    ],
};
```