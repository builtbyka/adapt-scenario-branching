define([
    'coreJS/adapt',
    'coreViews/articleView'
], function (Adapt, CoreArticleView) {
    var ScenarioBranchingView = {
        notUsed: [],

        postRender: function () {
            //console.log("SimpleBranchingView"+":"+this.model.get("_id"), "postRender");

            CoreArticleView.prototype.postRender.call(this);
            if (this.model.isBranchingEnabled()) {
                this.hideBlocks();
                if (this.model.isQuestionComplete()) {
                //     //display appriopriate component
                    this.showBlocks();
                } else {
                    this.listenTo(this.model.getQuestionModel(), "change:_isInteractionComplete", this.onQuestionComplete);
                }
            }
        },
        hideBlocks: function () {

            var blockModelScenario = this.model.get('_scenario'),
            ans = blockModelScenario.answers;
            for(key in ans){
                var blockModel = Adapt.findById(ans[key]);
                blockModel.set("_isAvailable", false);
                blockModel.set("_isVisible", false);
                 try {
                    $("." + blockModel.get("_id")).addClass("display-none");
                } catch (e) {
                    console.error(e);
                }

                Adapt.trigger("pageLevelProgress:update");

            }  
        },
        showBlock: function () {
            var models;
            var config = this.model.getConfig();
            var ansID;
          
         // Look in to setting completion

                //     //force completion of "hidden" child
            var config = this.model.getConfig();
            if (config.answers.hasOwnProperty("0")) {
                var notAns = this.model.isQuestionNotAnswer();
                for (var i = 0, len = notAns.length; i < len; i++) {
                    var nu = this.model.getAnswerModel(notAns[i]);
                    if(!this.notUsed.includes(nu[0].attributes._id)) this.notUsed.push(nu[0].attributes._id);
                }
            }else if (config.answers.hasOwnProperty("correct") && config.answers.hasOwnProperty("incorrect")) {
                if (!this.model.isQuestionCorrect()) {
                    var nu = this.model.getCorrectModel();
                    if(!this.notUsed.includes(nu[0].attributes._id)) this.notUsed.push(nu[0].attributes._id);
                } else {
                    var nu = this.model.getIncorrectModel();
                    if(!this.notUsed.includes(nu[0].attributes._id)) this.notUsed.push(nu[0].attributes._id);
                }
            }
      


            if (config.answers.hasOwnProperty("0")) {
                var ans = this.model.isQuestionAnswer();
       
                //show chosen answer
                models = this.model.getAnswerModel(ans);
                ansID = models[0];

                if(this.notUsed.includes(models[0].attributes._id)){
                    var i = this.notUsed.indexOf(models[0].attributes._id);
                    if(i != -1) {
                        this.notUsed.splice(i, 1);
                    }
                }
                //var notAns = this.model.isQuestionNotAnswer();

                // for (var i = 0, len = notAns.length; i < len; i++) {
                //     //this._disableModel(this.model.getAnswerModel(notAns[i]));
                // }
                
            } else if (config.answers.hasOwnProperty("correct") && config.answers.hasOwnProperty("incorrect")) {
                if (this.model.isQuestionCorrect()) {
                    //show 'correct' component
                    models = this.model.getCorrectModel();
                    ansID = models[0];
                    if(this.notUsed.includes(models[0].attributes._id)){
                        var i = this.notUsed.indexOf(models[0].attributes._id);
                        if(i != -1) {
                            this.notUsed.splice(i, 1);
                        }
                    }
                } else {
                    //show 'incorrect' component
                    models = this.model.getIncorrectModel();
                    ansID = models[0];
                    if(this.notUsed.includes(models[0].attributes._id)){
                        var i = this.notUsed.indexOf(models[0].attributes._id);
                        if(i != -1) {
                            this.notUsed.splice(i, 1);
                        }
                    }
                }
                //disable hidden children
                if (!this.model.isQuestionCorrect()) {
                   // this._disableModel(this.model.getCorrectModel());
                } else {
                   // this._disableModel(this.model.getIncorrectModel());
                }
            }

            if (models && models.length > 0) {
                for (var i = 0, max = models.length; i < max; i++) {
                    var m = models[i];
                    $("." + m.get("_id")).removeClass("display-none");
                    m.set("_isAvailable", true);
                    m.set("_isVisible", true);
                }
            }


            if(models[0].attributes._classes === 'concluding') this._setCompletionOnModel();

            Adapt.trigger("pageLevelProgress:update");
        },

        _setCompletionOnModel: function () {
           //console.log("SimpleBranchingView" + ":" + this.model.get("_id"), "_setCompletionOnModel(models, status)", models, status);
            
                for (var i = 0; i < this.notUsed.length; i++) {
                    var model = Adapt.findById(this.notUsed[i]);
                    model.set({
                        "_isComplete": true,
                        "_isInteractionComplete": true
                    });
                }

                this._disableModel();
    
        },
        _disableModel: function () {
           //console.log("SimpleBranchingView" + ":" + this.model.get("_id"), "_disableModel(models)", models);

            for (var i = 0; i < this.notUsed.length; i++) {
                var model = Adapt.findById(this.notUsed[i]);
                model.set({
                    "_isEnabled": false,
                    "_navButtons": {
                        "_isEnabled": false
                    }
                });

            }
        },
        onQuestionComplete: function (model, value, isPerformingCompletionQueue) {
            if (value) {
                this.showBlock();
            }
        }
    };

    return ScenarioBranchingView;
});
