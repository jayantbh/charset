# Charset

A collection of SVGs with paths of their respective alphabets in various fonts.

![image](https://i.snag.gy/ZsoQ2R.jpg)

Adobe XD files for uppercase and lowercase letters are present separately. The reason being that when all letters are changed to paths, their names are set from Path 2 to Path 27. If they are all put in the same file, their remains no order between the letters and their path names.

With the order that we have with names from Path 2 to Path 27, we can use out script `process.js` to automate the inlining of SVG styles, and moving them to respective directory.

## Instructions:
### For generating a new charset
1. Open CharSet_Lowercase.xd or CharSet_Uppercase.xd depending on the case.
2. Select all letters (Ctrl/Cmd + A) and change the font.
3. Right click any letter -> Path -> Convert to Path.
4. All letters should have turned into respective paths. From A being `Path 2` to Z being `Path 27`.
5. Select all paths in the Layers sidebar.
6. Right click any path there -> Mark for batch export.
7. Right click any path there -> Export batch.
8. In Export Assets window: Format: SVG; Optimized: true; Export to: `/path/to/project_root`.
9. Click `Export`!
10. In project root, you could have 26 SVGs, named from `Path 2.svg` to `Path 27.svg`.
11. Run `node process.js "My Font Name" ...` (see `process.js` instructions below)
12. Done!

### For using `process.js`
```sh
node process.js "Font Family" upper(default)|lower

# Examples:
node process.js "San Francisco" lower
node process.js "Roboto"
```