define([
    'coreJS/adapt',
    'coreModels/blockModel'
], function (Adapt, CoreBlockModel) {
    var BRANCHING_ID = "_scenario";
    var ScenarioBranchingModel = {


        setupModel: function () {
            CoreBlockModel.prototype.setupModel.call(this);
            var o = this.get(BRANCHING_ID);
            if (!o.hasOwnProperty("_isEnabled")) {
                o._isEnabled = true;
            }
        },
        setCompletionStatus: function () {
            this.set({
                "_isComplete": true,
                "_isInteractionComplete": true,
            });
        },

        // //PUBLIC
        isBranchingEnabled: function () {
            var o = this.get(BRANCHING_ID);
            if (o && o._isEnabled && this.isConfigValid()) return true;
            return false;
        },
        getConfig: function () {
            var config = this.get(BRANCHING_ID);

            return config;
        },
        // /**
        //  * Checks if the config object passed from JSON is valid
        //  */
        isConfigValid: function () {
            var config = this.getConfig(),
                id = this.get("_id"),
                result = true;
            //
            if (!config.hasOwnProperty("questionId")) {
                console.error("BranchingBlockModel", "Missing 'questionId' property in block '" + id + "'.");
                return false;
            } else {
                //check if it exists and is NOT child of this block
                var questionModel;
                try {
                    questionModel = Adapt.findById(config.questionId);
                } catch (e) {}

                if (!questionModel) {
                    console.error("BranchingBlockModel", "There is no component mentioned in 'questionId' ('" + config.questionId + "') for block '" + id + "'.");
                    return false;
                }
            }

             //This was from simple branching. Checked with the user had filled in a correct or incorrect. I am expanding to include more than two options
            if(config.hasOwnProperty("answers")){
                if (config.answers.hasOwnProperty("0")) {
                    if (this.isUsingUserAnswer()) {
                        var ans = config.answers,
                            strAns = '';
                        for (var key in ans) {
                            strAns += ans[key]+',';
                        }
                        strAns = strAns.slice(0, -1);

                        result = this._checkUserAnswerModel(strAns, id);
                    }
                }else if (config.answers.hasOwnProperty("correct") && config.answers.hasOwnProperty("incorrect")) {
                    if (this.isUsingCorrect()) {
                        result = this._checkCorrectModel(config.answers.correct, id);
                    }
                    if (this.isUsingIncorrect()) {
                        result = this._checkIncorrectModel(config.answers.incorrect, id);
                    }
                }
            }else{
                    console.error("BranchingBlockModel", "Missing 'answers either by number or correct/incorrect' property in block '" + id + "'.");
            }
            
            return result;
        },


        isQuestionComplete: function () {
            var questionModel = this.getQuestionModel();

            return questionModel ? questionModel.get("_isComplete") : false;
        },
        isQuestionCorrect: function () {
            var questionModel = this.getQuestionModel();

            return questionModel ? questionModel.get("_isCorrect") : false;
        },
        isQuestionAnswer: function () {
            var questionModel = this.getQuestionModel();
            var answer = questionModel.get("_userAnswer");
        return answer.indexOf(true);
        },
        isQuestionNotAnswer: function () {
            var questionModel = this.getQuestionModel(),
                answer = questionModel.get("_userAnswer"),
                notAnswer = [];
            for (var i = 0, len = answer.length; i < len; i++) {
                if(!answer[i]) notAnswer.push(i);
            }
        return notAnswer;
        },
        /**
         * Returns Question model
         */
        getQuestionModel: function () {

            var config = this.getConfig();

            return this._getModel(config.questionId);
        },
        
        isUsingUserAnswer: function () {
            var config = this.getConfig();
            return config.userAnswer !== "";
        },
        isUsingCorrect: function () {
            var config = this.getConfig();
            return config.correct !== "";
        },
        isUsingIncorrect: function () {
            var config = this.getConfig();
            return config.incorrect !== "";
        },
       

        // /**
        //  * An array of models associated with correct answer
        //  */
        getAnswerModel: function (ans) {
            if (!this.isUsingUserAnswer()) return;
            var config = this.getConfig(),
            ids = config.answers[ans];
            return this._getModels(ids);
        },

        // /**
        //  * An array of models associated with correct answer
        //  */
        getCorrectModel: function () {
            if (!this.isUsingCorrect()) return;
            var config = this.getConfig(),
            ids = config.answers.correct;
            return this._getModels(ids);
        },
        // /**
        //  * An array of models associated with incorrect answer
        //  */
        getIncorrectModel: function () {
            if (!this.isUsingIncorrect()) return;

            var config = this.getConfig(),
                ids = config.answers.incorrect;
            return this._getModels(ids);
        },

        // //PRIVATE
        _checkUserAnswerModel: function (ids, id) {
            return this._checkModel(ids, id, "answers");
        },
        _checkCorrectModel: function (ids, id) {
            return this._checkModel(ids, id, "correct");
        },
        _checkIncorrectModel: function (ids, id) {
            return this._checkModel(ids, id, "incorrect");
        },
        _checkModel: function (ids, id, type) {
            //console.info("BranchingBlockModel", "_checkModel", arguments);
            var model;

                if (ids.indexOf(",") == -1) {

                    model = this._getModel(ids);

                    if (!model) {
                        console.error("BranchingBlockModel", "There is no block mentioned in '" + type + "' ('" + ids + "') for block '" + id + "'.");
                        return false;
                    }

                } else {
                    var listIds = ids.split(",");
                    var result = false,
                        i = 0;
                    while (listIds.length > 0) {
                        var li = listIds.pop();
                            result = this._checkModel(li, id, type);
                        if (!result) break;
                    }

                    return result;
                }
                return true;

        },

        _getModels: function (ids) {
            if (ids.indexOf(",") == -1) {
                var model = this._getModel(ids);
                if (model) return [model];
            }else {
                var listIds = ids.split(","),
                    i = 0,
                    result = [];

                while (listIds.length > 0) {
                    var id = listIds.pop();
                    var model = this._getModel(id);

                    if (!model) {
                        return;
                    } else {
                        result.push(model);
                    }
                }
                return result;
            }
            return;
        },
        _getModel: function (id) {
            try {
                var model = Adapt.findById(id);
            } catch (e) {}

            return model;
        }
    }
    return ScenarioBranchingModel;
});
