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

[^1]: Template Object Documentation (Next.js) - https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template-object
[^2]: `absolute` property in template object (Next.js) - https://nextjs.org/docs/app/api-reference/functions/generate-metadata#absolute