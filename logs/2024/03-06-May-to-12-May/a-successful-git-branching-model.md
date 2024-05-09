## A Successful Git Branching Model

Finally got around to reading this amazing article - https://nvie.com/posts/a-successful-git-branching-model/. It's explains a mental model around how you can manage your branches and keep them aligned with your features, releases, bugs and hotfixes while maintaining a separate production and development states parallelly. 

TODO: Add Image here

Helped revise some old concepts on different ways merges take place - fast-forward, rebase, squash and others. And also understand the need to the `--no-ff` flag while merging branches [^1]. This flag places all the commits in branch it stemped from into a new single commit unlike fast-forward that just places the commit into the same branch of the HEAD.

### Git - Tagging

TIL: You can addd tags in your local git commit history, modify them and just like pushing your commited changes, you have to push your tags to a remote server as well. 

The docs are sufficient on understanding the flow: https://git-scm.com/book/en/v2/Git-Basics-Tagging

[^1]: https://stackoverflow.com/questions/9069061/what-effect-does-the-no-ff-flag-have-for-git-merge - look at the answer for this, it's really detailed. 
