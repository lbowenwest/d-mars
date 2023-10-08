# Daphne Engineering Challenge

## Running 

This command should run the sample input (included in the `tests` directory)
```sh
npm install 
npm run main
```

To run any input 
```
node dist/index.js <input file>
```

And to run the tests
```shell
npm run test
```

## Thoughts

I've mostly assumed that the input will be in the correct format, there's a little bit of error processing, but it's 
mainly around blowing up in the parsing stage if it's not what it expects. The spec doesn't really say what to do if 
the robot starts outside the world surface, so I opted for raising an error. You could also let it go through and make 
sure that you check the initial position when evaluating the instructions, but then what would you report as the final 
position? The spec did mention that the max value for any coordinate is 50, I've included that in the parsing step but 
wasn't sure if that was what was intended, or just to give an indication of the input size. 

I split up the functions a little to make things slightly organised, and maybe a little too much for such a small project, 
but thought it was worthwhile. 

It also didn't mention if you should use external libraries for anything, I opted to use a couple (commander and lodash)
to do a few things and make the argument parsing nicer, and jest for a testing framework. 