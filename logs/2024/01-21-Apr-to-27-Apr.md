## Table of Contents

1. [Work Updates](#work-updates)
2. [How to Document a database?](#how-to-document-a-database-1)
3. [Editing Time for Past Commit Messages](editing-time-for-past-commit-messages-3)

## Work updates

Officially started work at Trustworthy, annd assigned to work on a feature end-to-end (using next.js as frontend and nest.js as backend). Focusing on the frontend as now, creating the components. 

Along with that, trying to take up initiative on writing documentation for the team and the dev process in general. Came across this post that helped clear somethings in particular to database documentation. 

## How to Document a database? [^1]

Got an insightful answer from Stackoverflow [^2].

> In my experience, ER (or UML) diagrams aren't the most useful artifact - with a large number of tables, diagrams (especially reverse engineered ones) are often a big convoluted mess that nobody learns anything from.
>
> For my money, some good human-readable documentation (perhaps supplemented with diagrams of smaller portions of the system) will give you the most mileage. This will include, for each table:
>
> - Descriptions of what the table means and how it's functionally used (in the UI, etc.)
> - Descriptions of what each attribute means, if it isn't obvious
> - Explanations of the relationships (foreign keys) from this table to others, and vice-versa
> - Explanations of additional constraints and / or triggers
> - Additional explanation of major views & procs that touch the table, if they're not well documented already
> - With all of the above, don't document for the sake of documenting - documentation that restates the obvious just gets in people's way. Instead, focus on the stuff that confused you at first, and spend a few minutes writing really clear, concise explanations. That'll help you think it through, and it'll massively help other developers who run into these tables for the first time.
>
> As others have mentioned, there are a wide variety of tools to help you manage this, like [Enterprise Architect](http://www.sparxsystems.com.au/), [Red Gate SQL Doc](http://www.red-gate.com/products/SQL_Doc/index.htm), and the built-in tools from various vendors. But while tool support is helpful (and even critical, in bigger databases), doing the hard work of understanding and explaining the conceptual model of the database is the real win. From that perspective, you can even do it in a text file (though doing it in Wiki form would allow several people to collaborate on adding to that documentation incrementally - so, every time someone figures out something, they can add it to the growing body of documentation instantly).

## Editing Time for Past Commit Messages [^3]

Okay, so sometimes we don't always work on time, and we pretend to do the work right 😅. Knowing that you can do the work on time, but need to show proof that you did it in the past, found this way to edit the commit time on your commit history.

Reference to the answer from StackOverflow [^4]

For now, the flow I'm following is this:

- Write code or specific piece of progress (don't commit everything together in a single commit)
- Stage and commit as usual.
- Use this command to edit the latest commits time -
  ```bash
  GIT_COMMITTER_DATE="Mon Apr 22 9:40 2024 +0530" git commit --amend --date "Mon Apr 22 9:40 2024 +0530" --no-edit
  ```
- For proper date formats refer to this article - [https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-commit.html#_date_formats](https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-commit.html#_date_formats)

The GIT_AUTHOR_DATE and GIT_COMMITTER_DATE environment variables support the following date formats:

> **Git internal format**
> 
> It is <unix-timestamp> <time-zone-offset>, where <unix-timestamp> is the number of seconds since the UNIX epoch. <time-zone-offset> is a positive or negative offset from UTC. For example CET (which is 1 hour ahead of UTC) is +0100.
>
> **RFC 2822**
> 
> The standard date format as described by RFC 2822, for example Thu, 07 Apr 2005 22:13:13 +0200.
>
> **ISO 8601**
>
> Time and date specified by the ISO 8601 standard, for example 2005-04-07T22:13:13. The parser accepts a space instead of the T character as well. Fractional parts of a second will be ignored, for example 2005-04-07T22:13:13.019 will be treated as 2005-04-07T22:13:13.
>
> *Note*
> 
> In addition, the date part is accepted in the following formats: YYYY.MM.DD, MM/DD/YYYY and DD.MM.YYYY.
> In addition to recognizing all date formats above, the --date option will also try to make sense of other, more human-centric date formats, such as relative dates like "yesterday" or "last Friday at noon".

With the mentioned command, I've set the committer date in the start and the author-date as the same on the date flag.

Here's a simple explanation of the two dates involved during a commit - GIT_AUTHOR_DATE and GIT_COMMITTER_DATE are environment variables in Git that store the date and time of a commit. The author date is the date and time that the changes were originally written, while the committer date is the date and time that the changes were committed to the repository.

Author date will always be the same date when you make the commit and it's usually the same as the commit date, however when there's some changes like merging / rebasing and amends, the commit date will be different from the author date. [^5]

[^1]: Original Question from Stackoverflow: https://stackoverflow.com/questions/369266/how-to-document-a-database
[^2]: Answer for the same: https://stackoverflow.com/a/369379/14187429
[^3]: Question Reference: https://stackoverflow.com/questions/454734/how-can-one-change-the-timestamp-of-an-old-commit-in-git
[^4]: Answer for the same: https://stackoverflow.com/a/32733750/14187429
[^5]: Simple explanation on author and commit dates: https://stackoverflow.com/a/11857467/14187429
