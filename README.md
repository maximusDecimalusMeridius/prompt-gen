# prompt-gen
Google AppScript for constructing, deconstructing, and archiving AI-art prompts

# Usage

When added into code.gs file for a google sheet, allows the user to:

- Build a prompt by selecting checkboxes for different attributes (drop-down, static, or free-form), prioritizing any value that is not an attribute of the output file (--ar 3:2, for instance).

- Deconstruct a prompt based on different delimiters (, ; :) - Note: User can only split by one delimiter at a time.  Prompts with multiple delimiters will have to be run through multiple times.

- Build dropdown menus via the data tab

- Review past constructed and deconstructed prompts in the prompt archive

# License
MIT License
