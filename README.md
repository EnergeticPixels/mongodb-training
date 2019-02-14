# <center>Mongoose/MongoDB Training</center>
### <center>The Complete Developers Guide</center>

## Mission:
This is result of Stephen Grider's training that is hosted on Udemy.com. First commit in this repo stems from my 'starting block' (https://github.com/EnergeticPixels/boilerplate).

## Development Methodology:
Using mocha for proof of mongoose. I have purposely left the branches in-tact in this repo so that I can separate code belonging to the specific MongoDB/Mongoose ODM more easily.  More of a teaching tool for myself.  Branch names equate to specific code:
- feature/sect6 = Basic CRUD operations.  No frills, but this is the starting point for all other branches.
- feature/sect7 = mongodb $inc operator
                = simple validation rules
                = custom validation rules
- feature/sect8 = adds sub-documents
                = removes subdoc from existing doc
                = adds virtual field with a 'get' function 
                = fixes $inc mongodb operation
- feature/sect9 = tests deeply nested operations
                = saves a user / blogpost in separate collections
- feature/sect10 = Cleans up blogposts when a user is removed
- feature/sect11 = Sort / Skip / Limit operations on the result

## Accolades
- Stephen Grider. (https://www.udemy.com/the-complete-developers-guide-to-mongodb/learn/v4/overview)


### Node Technologies:
- NODE: version 8 or above.  NPM: version 6 or above.
- Babel: Transpiling advanced javascript code. At this point, taking care of the 'imports' and 'exports default' statement
- Mocha

###  TODOs
- I may, at a later date, install mongodb-memory-server so that the project/package is self-contained entity.

## Quick Start ##
If you're new to Node.js, these steps will get you started. You will need a active MongoDB instance running before "npm run test". If you do not use a localhosted MongoDB, you will want to modify the mongoose.connect statement that resides inside the test_helper.js file to the address that you are using for MongoDB.

1. [Install Node.js](http://nodejs.org/download/).
2. Download/clone this project to a working directory.
3. Change to the above working directory. 
3. In a command line 'window': npm install && npm run test
