# How to Document a database? [^1]

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

[^1]: Original Question from Stackoverflow: https://stackoverflow.com/questions/369266/how-to-document-a-database
[^2]: Answer for the same: https://stackoverflow.com/a/369379/14187429