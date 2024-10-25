## Using S3 Storage Plugin in Payload CMS with Next.js

> Note: Working in Payload - `3.0.0-beta.58` at the moment with reference to the [`multi-tenant-single-domain`](https://github.com/payloadcms/payload/tree/v3.0.0-beta.82/examples/multi-tenant-single-domain) configuration.

Getting the S3 Storage Plugin to work was a bit tricky compared to what I had worked with previously -> Payload CMS on Server side with GCS instead of S3. 

Difference I faced were: 

1. There's no `staticURL` configuration, and the package version I am using has no support on the `generateFileName` function on the plugin option.
2. S3 configuration works updates on the Bucket Policy, the IAM user credentials and getting the endpoint URL was a bit hard as well (made a few typos here).
3. Make sure the IAM user credentails (key and secret) has accesss to the bucket.
4. Bucket policy has public reads enabled.
5. Bucket endpoint should look something like this - `https://s3.{region}.amazonaws.com` even though the actual endpoint is `https://{bucket-name}.s3.{region}.amazonaws.com`, the `bucket-name` gets added automatically by the plugin.

## Other References 

1. [How to deploy PayloadCMS to Digitialocean and connect to S3 bucket](https://www.showwcase.com/article/18570/how-to-deploy-payloadcms-to-digitialocean-and-connect-to-s3-bucket)
2. [Payload CMS Setup Tutorial Part 4: Adding S3 Object Storage for file uploads](https://www.youtube.com/watch?v=25BCE_hx2yA)
