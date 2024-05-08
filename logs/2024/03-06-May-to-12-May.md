## Table of Contents

- [Template Object in Next.js Metadata Configuration](#template-object-in-nextjs-metadata-configuration-1)
- [Focus, Focus Within, Focus Visible Psuedo Selectors](#focus-focus-within-focus-visible-psuedo-selectors)
- [Styling Scrollbar with Tailwind Classes](#styling-scrollbar-with-tailwind-classes)

## Template Object in Next.js Metadata Configuration [^1]

Didn't know this existed until this week. This will definitely save some time and really useful how it work as well. 

Instead of passing the title as a string directly, you can have an object configuration to define how the title should work in parent and child routes based on the layout and page configs. 

For a top level title ("Company") and for the child routes - eg: ("About | Company") or ("Pricing | Company") we can do something like this

```ts
// app/layout.tsx
export const metadata: Metadata = {
    title: {
        template: '%s | Company",
        default: 'Company',
    }
}
```

For the layout it is defined in, it will use `default` as the title and all child routes will pick up the template replacing the string formatter (ig - `%s`) with the title defined in that page.

So if you have an about page, like

```ts
// app/about/page.tsx
export const metadata: Metadata = {
    title: "About"
}
```

and the output would be like this for that page

```html
<title>About | Company</title>
```

And if you need to ignore the template, simply use the `absolute` [^2] property on that page to place it's own title.

## Focus, Focus Within, Focus Visible Psuedo Selectors 

Got to understand the difference between these 3 and how to use them. `:focus` is activited when a element is clicked, tapped or tabbed over by the keyboards `Tab` key. `:focus-within` selects the element if any of it's children have been clicked, tapped or tabbed over by the keyboards `Tab` key and `:focus-visible` is used to apply focus when the keyboards `Tab` key is used to nativate towards it and not focus via and other focus events, this is usually used when you want to retain the theme of the website, and also make it accessible for users using keyboards to navigate around the website. 

References: [^3], [^4], [^5], [^6]

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

[^1]: Template Object Documentation (Next.js) - https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template-object
[^2]: `absolute` property in template object (Next.js) - https://nextjs.org/docs/app/api-reference/functions/generate-metadata#absolute
[^3]: Article on focus psuedo selectors - https://bharathvaj-ganesan.medium.com/focus-vs-focus-within-vs-focus-visible-2db18593495b
[^4]: focus on MDN - https://developer.mozilla.org/en-US/docs/Web/CSS/:focus
[^5]: focus-within on MDN - https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within
[^6]: focus-visible on MDN - https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible

