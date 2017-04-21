# adapt-scenario-branching
An Adapt framework extension to add simple branching functionality. Based on the results of the question the scenario-branching block can display/hide it's components.

## Installation

Download the ZIP and extract into the src > extensions directory and run an appropriate Grunt task.

## Usage

Add the `_scenario` entry to the block that will have alternate content

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

## Notes

* Makes components _isAvailable: false
* Adds display-none class to component div
* Refreshes PLP.

## Tested on

IE8, IE11, Chrome 48, Firefox 44