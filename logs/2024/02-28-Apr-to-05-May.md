## Table of Contents

- [Difference between Captions & Subtitles](#difference-between-captions--subtitles)
- [Adding captions and subtitles to HTML video](#adding-captions-and-subtitles-to-html-video-1)
- [Video Transcription](#video-transcription)
- [Using Sanity CMS with Next.js App Router](#using-sanity-cms-with-nextjs-app-router-4)


## Difference between Captions & Subtitles

It's a subtle one, but they are not the same. Captions are generally directed to people with hearing disabilities and specific to how they can interpret sounds via words, whereas subtitles are under the consideration that the person can hear but cannot understand the foreign language the audio is in.

It's really interesting study and how you can also make it more accessible - learnt it from here - [https://web.archive.org/web/20160117160743/http://screenfont.ca/learn/](https://web.archive.org/web/20160117160743/http://screenfont.ca/learn/)

## Adding captions and subtitles to HTML video [^1]

Exploring the WebVTT API and the track tags. Both can be used as per preference. I've yet to implement it as of today (30th April), was exploring this as part of a solution of what to do post subtitle generation from the video.

Previously I would've gone with rendering the subtitles as part of the video, but the problem statement includes that the user can edit these subtitles at a later point. 

Hence a better approach would be to store the subtitles as a .vtt file and feed it into the video tag via tracks. I see this as

1. It saves time to not have to render the video over and over for different subtitles, only the `.vtt` file is enough to be modified.
2. Can be used on both user and customer front, sort of drops the need for a video transcoding tools like `ffmpeg` for now.
3. Saves computing time that rendering will take, it's easier and quicker to edit a text file than modify the whole video.

## Video Transcription 

Turns out you don't need to reinvent the wheel 😅. AWS [^2] & GCP [^3] both offer speech-to-text transcription services at a decent price. 

Planning to use this at Trustworthy for video transcription, not at the moment, but will have to get to this eventually.

p.s. Transcribing is the process of writing out a copy of something, while transcription is the written version of something spoken. (somewhat the same, just different way of how AWS & GCP refer to the same thing)

## Using Sanity CMS with Next.js App Router [^4]

Have been using this for a while, really handy with clients who are looking for a custom solution with control over the content of the website (blogs, posts, team members, others...). 

Setup is straight forward, but writing the configs, schemas and queries does become time consuming for each new project (given how often I tend to use it with clients). Currently planning to create a template repo with next.js, sanity, shadcn-ui, eslist, prettier & husky for future usage, would make things a bit easier. (Hoping to finish this by next week!)

The steps are straightforward to 

1. Update your `next.config.ts` file to allow images from Sanity.

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
    remotePatterns: [
    {
        protocol: "https",
        hostname: "cdn.sanity.io",
    },
    ],
},
experimental: {
    taint: true,
},
// ...other config settings
};

export default nextConfig;
```

2. Create a new Sanity project. (will probably have to include a guide on how to create a new project on an already existing configuration)

```bash
npx sanity@latest init --env --create-project "<PROJECT-NAME-HERE>" --dataset production

> Would you like to add configuration files for a Sanity project in this Next.js folder?
Yes

> Do you want to use TypeScript?
Yes

> Would you like an embedded Sanity Studio?
Yes

> Would you like to use the Next.js app directory for routes? 
Yes

> What route do you want to use for the Studio?
/studio

> Select project template to use 
Blog (schema)

> Would you like to add the project ID and dataset to your .env file?
Yes
```

3. Check if `.env` file is crated and rename it to `.env.local`

```env
# ./.env.local

NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

4. Create a fetch function to fetch documents from Sanity in `sanity/lib/fetch.ts`

```ts
// ./sanity/lib/fetch.ts

import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { client } from "./client";
// import { token } from "./token";

/**
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective then time-based revalidation is used, set to match the time-to-live on Sanity's API CDN (60 seconds)
 * and will also fetch from the CDN.
 * When using the "previewDrafts" perspective then the data is fetched from the live API and isn't cached, it will also fetch draft content that isn't published yet.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = draftMode().isEnabled ? "previewDrafts" : "published",
  /**
   * Stega embedded Content Source Maps are used by Visual Editing by both the Sanity Presentation Tool and Vercel Visual Editing.
   * The Sanity Presentation Tool will enable Draft Mode when loading up the live preview, and we use it as a signal for when to embed source maps.
   * When outside of the Sanity Studio we also support the Vercel Toolbar Visual Editing feature, which is only enabled in production when it's a Vercel Preview Deployment.
   */
  stega = perspective === "previewDrafts" ||
    process.env.VERCEL_ENV === "preview",
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
}) {
  if (perspective === "previewDrafts") {
    return client.fetch<QueryResponse>(query, params, {
      stega,
      perspective: "previewDrafts",
      // The token is required to fetch draft content
      // token,
      // The `previewDrafts` perspective isn't available on the API CDN
      useCdn: false,
      // And we can't cache the responses as it would slow down the live preview experience
      next: { revalidate: 0 },
    });
  }
  return client.fetch<QueryResponse>(query, params, {
    stega,
    perspective: "published",
    // The `published` perspective is available on the API CDN
    useCdn: true,
    // Only enable Stega in production if it's a Vercel Preview Deployment, as the Vercel Toolbar supports Visual Editing
    // When using the `published` perspective we use time-based revalidation to match the time-to-live on Sanity's API CDN (60 seconds)
    next: { revalidate: 60 },
  });
}
```

5. Update the queries that will be passed into the fetch function.

```ts
// ./sanity/lib/queries.ts

import { groq } from "next-sanity";

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug)]`;

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]`;
```

6. If your main purpose of using Sanity is for Blog Posts, then make sure to use blockQuote type with the relevant packages to show clear distinction between various heading levels and text formats.

```bash
pnpm install -D @tailwindcss/typography # using prose for applying heading and text distincions
pnpm install @portabletext/react # sort out sanity blocks (h1, h2, p, u) to appropriate tags to apply prose class with
```

```ts
// ./tailwind.config.ts

module.exports = {
  // ...other settings
  plugins: [require('@tailwindcss/typography')],
}
```

Example of how to use all together:

```ts
// ./components/Post.tsx

import Image from "next/image"
import { PortableText } from "@portabletext/react"
import imageUrlBuilder from "@sanity/image-url"
import { SanityDocument } from "next-sanity"

import { dataset, projectId } from "@/sanity/env"

const urlFor = (source: any) =>
  imageUrlBuilder({ projectId, dataset }).image(source)

export default function Post({ post }: { post: SanityDocument }) {
  const { title, mainImage, body } = post

  return (
    <main className="container mx-auto prose prose-lg p-4">
      {title ? <h1>{title}</h1> : null}
      {mainImage ? (
        <Image
          className="float-left m-0 w-1/3 mr-4 rounded-lg"
          src={urlFor(mainImage).width(300).height(300).quality(80).url()}
          width={300}
          height={300}
          alt={mainImage.alt || ""}
        />
      ) : null}
      {body ? <PortableText value={body} /> : null}
    </main>
  )
}
```

Also make sure to create a type annotation for your BlogPost that reflects your Sanity Schema for the same.


[^1]: MDN Article on Adding captions and subtitles to HTML video - https://developer.mozilla.org/en-US/docs/Web/Media/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
[^2]: Video Transcription via AWS - https://aws.amazon.com/pm/transcribe
[^3]: Video Transcription via GCP - https://cloud.google.com/video-intelligence/docs/transcription
[^4]: Setting up Sanity CMS with App Router - https://www.sanity.io/guides/nextjs-app-router-live-preview