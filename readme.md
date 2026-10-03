#MeowMusic Player
(name uncertain)

###THE IDEA

Create a new music player like my old one, AaronOS Music,
    but better implemented, with a smoother user experience,
    and more easily extensible.

###OBJECTIVES

Better code
    Document all code thorougly.
    Modularise all code into relevant files instead of single-file monoliths.

Better performance.
    The old one performed abysmally on phones. Figure out what went wrong.

More immersive user interface
    The user should intuitively understand the controls without having to search for them.
    The controls shouldn't detract from the experience; they appear when needed then disappear.
    The app should remember all settings used previously, including the working directory if possible.
    Provide options within the interface to customize visualizers and themes.

More modular visualizers and themes
    A module should provide a set of common functions for visualizers and themes to use.
    Provide sensible module interfaces rather than dumping everything into global scope.
    Hopefully, make it intuitive enough that a user could easily create their own visualizer.
    Spawn elements dynamically on-demand rather than hard-coding elements and values.
        For example visualizers are spawnable and you could hopefully run multiple at once.
        Menus for selecting visualizers could have live preview thumbnails rather than image assets?

More effective use of visualizer data
    The old one literally threw 2/3 of the data into the trash, and didn't use the data it had very effectively.
    I can make these things look a lot better if I put more attention into that.

Less copycat visualizers and themes
    Rather than half a dozen similar items, combine small changes into settings for one unique item.
    More configurable options means the user can get exactly what they need easily.

Standardize the code
    It's pretty obvious I started this and then took a months-long break before coming back...
    Try to use the same practices across modules.

Explore all the new tools I've missed
    New HTML, CSS, JS tools that weren't around back then. Give them all a whirl and see if they make things easier.