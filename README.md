# extended of previous work 
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
            "incorrect": "c-10",
            "correct": "c-15",
            "forceCompletion": false
        }
```

* `questionId` the question component ID which this branching block will listen for results
* `incorrect` the component ID within the branching block that will be displayed when user will answer incorrectly
* `correct` the component ID within the branching block that will be displayed when user will answer correctly
* `forceCompletion` defaults to true, boolean flag indicating if the completion status should be set on the components

Further to this you can provide more than two options using 'userAnswer'.


```
        "_scenario": {
            "questionId": "c-05",
            "userAnswer" : {
                "0" : "c-10",
                "1" : "c-15",
                "2" : "c-20"
            },
            "forceCompletion": false
        }
```

* `questionId` the question component ID which this branching block will listen for results
* `userAnswer` reflects order of 'items' in the question component json (even if randomised on the front end)
* `forceCompletion` defaults to true, boolean flag indicating if the completion status should be set on the components

## Notes

* Makes components _isAvailable: false
* Adds display-none class to component div
* Refreshes PLP.

## Tested on

IE8, IE11, Chrome 48, Firefox 44
