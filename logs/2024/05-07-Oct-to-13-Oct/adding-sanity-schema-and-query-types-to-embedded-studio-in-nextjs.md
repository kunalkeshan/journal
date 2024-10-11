## Adding Sanity Schema And Query Types To Embedded Studio In Nextjs

> [!NOTE]
> Sanity TypeGen was launched in beta in [sanity@3.34.0](https://github.com/sanity-io/sanity/releases/tag/v3.40.0) (Make sure sanity types are updated if you're working on an old project)
> Typed content with Sanity TypeGen Course[^1]

### Generate Schema

```bash
npx sanity@latest schema extract
```

### Generate Types from Schema

```bash
npx sanity@latest typegen generate
```

### Modify input & types output destination 

Use the `sanity-typegen.json` in your project root to specify the following fields.

```json
{
  "path": "'../day-one-with-sanity-nextjs/src/**/*.{ts,tsx,js,jsx}'",
  "schema": "schema.json",
  "generates": "../day-one-with-sanity-nextjs/src/sanity/types.ts",
}
```

And voila! now you can import the types from the outputted types file and use it in your frontend code.

Have already implemented it previously but since working in an [old project](https://github.com/Sundar-Clinic/Main-Website) and updating the types with an old sanity version, making sure to document it for future reference.

[^1]: https://www.sanity.io/learn/course/typescripted-content
