## Clean Unnecessary Files from `C:` Drive

I'm kinda lazy in partioning the drive or expanding at the moment, so doing the following to keep the `C:` drive from getting full. 

```bash
docker system prune -a
```

This command is used to remove all unused Docker data including stopped containers, unused networks, dangling images, and build cache. The -a flag ensures that all unused images (not just dangling ones) are also removed.

```bash
pnpm store prune
```

This command cleans up the local pnpm store by removing old packages that are no longer needed. This helps in freeing up space by getting rid of unnecessary package files.

```bash
yarn cache clean
```

This command clears the yarn cache, which can grow significantly over time. Cleaning the cache helps in freeing up disk space by removing cached files that are no longer needed.
