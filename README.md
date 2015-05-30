# NovaeCalc
![NovaeCalc](http://i.imgur.com/irzQbPn.png)

# Description
NovaeCalc is a lightning browserbased spreadsheet software.
NovaeCalc is not stable yet.

## Current state:

 - [ ] Cell logic
   - [x] Infinite vertical scrolling (~ 2^53 - 1)
   - [x] Infinite horizontal scrolling (~ 16.100)
   - [x] Select cell fields in all directions
   - [x] Resize cell rows
   - [x] Edit cell content
   - [ ] Adjust cell size to its content 
   - [x] Custom cell styles
   - [ ] Mobile friendly
   - [x] Realtime cells

 - [ ] Functionalities
   - [x] Export projects
   - [x] Export projects as image
   - [x] Import project
   - [x] Import projects saved as image
   - [ ] Backup projects into LocalStorage
   - [ ] Jump to (x, y)
   - [ ] Debug

- [ ] Formula logic
   - [ ] Syntax
   - [ ] Multi-language support
   - [ ] String functions
   - [x] Numeric functions
   - [ ] Statistical functions
   - [x] Logical functions
   - [ ] Information functions
   - [ ] Date / Time functions
   - [x] JSON processing

- [ ] Server
   - [ ] Groups
   - [ ] Users
   - [ ] Roles
   - [ ] Administrative area
   - [ ] Share project
   - [ ] Multi-user live editing
   - [ ] Synchronization

## Todo:
- [ ] Increase cell resize performance (Each resized cell causes massive performance loss) -> Only perform resize if in-view!
- [ ] Interpreter function to round X to the nearest X

## Notes:
- [ ] Speed is a core feature
- [ ] Possibly include server-side cell calculation option
- [ ] Pow: Math.pow => (2^2)^2, LX_POW

## Bugs:
- [ ] Fast scrolling up and down causes wrong rendered selection areas (Only if scrolledY =^ 0)

## Libraries
 * [ImportJS](https://github.com/felixmaier/ImportJS)
 * [Eight Bit Color Picker](https://github.com/bilalq/eight-bit-color-picker)
