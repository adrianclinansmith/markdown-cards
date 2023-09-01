export const defaultMarkdown = `# Touch here
Swipe here

# Upload a file
Use the top left button to select the markdown file (.md) you wish to view as a
deck of cards.

# Refresh
Start at the beginning of the current deck with the refresh button.

# Font size
Change the font size with the scroll selector.

# Card format
- Headers are the card-fronts: \\# H1, \\## H2, etc.
- Text following a header is the card's back. 

~~~
# front 1
back 1
### front 2
back 2
~~~

# Math Expressions
\\$Inline math goes here.\\$  
  
\\$\\$  
Outline math goes here.   
\\$\\$   
  
For example:  
$$
\\sqrt{a + b^2} = c
$$

# Code Expressions
\\~\\~\\~cpp    
C++ code here ([see supported languages](https://prismjs.com))  
\\~\\~\\~   
For example:  
~~~cpp
for (int i = 0; i < 10; ++i) {
	std::cout << i << ' ';
}
~~~
`