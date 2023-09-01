# Markdown Cards

A webapp that converts markdown files into flashcards. Each header becomes the front of a card, and the following non-header is it's back.

Example markdown: 

```
# front of first card
back of first card
### front of second card
back of second card
```

Math expressions are rendered between dollar signs with KaTex:

```
# inline math
pythagorean theorem: $a^2 + b^2 = c^2$

# outline math
$$
a^2 + b^2 = c^2
$$
```

Code expressions are rendered between tildes: 

```
# C++ Code block
~~~cpp
    for (int i = 0; i < 10; ++i) {
        std::cout << i << ' ';
    }
~~~
```

## Acknowledgements

Rendered with [react-markdown](https://github.com/remarkjs/react-markdown)








