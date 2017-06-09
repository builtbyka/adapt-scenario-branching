# extention of previous work 
https://github.com/commelius/adapt-simple-branching Extended functionality of linked extension - to include more than two options. Work in progress. 

# adapt-scenario-branching
An Adapt framework extension to add scenario branching functionality. Based on the results of the question the scenario-branching block can display/hide it's components.

## Installation

Download the ZIP and extract into the src > extensions directory and run an appropriate Grunt task.

## Usage

Add the `_scenario` entry to the block that will have alternate content

You can use the original settings for this extension. Simple 'correct' or 'incorrect'

```
        "_scenario": {
            "questionId": "c-05",
            "answers" : {
                    "incorrect": "b-10",
                    "correct": "b-15"
             }
        }
```

* `questionId` the question component ID which this branching block will listen for results
* `incorrect` the component ID within the branching block that will be displayed when user will answer incorrectly
* `correct` the component ID within the branching block that will be displayed when user will answer correctly

Further to this you can provide more than two options using 'userAnswer'.


```
        "_scenario": {
            "questionId": "c-05",
            "answers" : {
                "0" : "b-10",
                "1" : "b-15",
                "2" : "b-20"
            }
        }
```

* `questionId` the question component ID which this branching block will listen for results
* `answers` reflects order of 'items' in the question component json (even if randomised on the front end)

## Notes

* Makes components _isAvailable: false
* Adds display-none class to component div
* Refreshes PLP.
