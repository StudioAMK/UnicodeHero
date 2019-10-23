const wordList = require("WordList");

cc.Class({
    extends: cc.Component,

    properties: {
        question: "123456",
        answer: "123",

        questionColor: {
            type: cc.Color,
            default: cc.Color.BLACK
        },
        correctColor: {
            type: cc.Color,
            default: cc.Color.GREEN
        },

        mainCtrl: {
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    init(obstacleLayoutList) {
        this.obstacleLayoutList = obstacleLayoutList;
        this.answerTextBox = this.node.getComponent(cc.EditBox);
        this.mainController = this.mainCtrl.getComponent('MainCtrl');
        this.nextOstacle = 0;
        this.questionRichText = this.obstacleLayoutList[this.nextOstacle].getChildByName('questionRichText').getComponent(cc.RichText);
        this.word = this.removeTags(this.questionRichText.string);
        this.setQuestion(this.word);
    },

    setQuestion(questionText) {
        this.question = questionText;
        this._updateQuestionUI("", questionText);

    },

    _updateQuestionUI(correctPart, remaingPart) {
        let correctHex = this.correctColor.toHEX("#rrggbb");
        let questionHex = this.questionColor.toHEX("#rrggbb");
        let textString = `<color=#${correctHex}>${correctPart}</c><color=#${questionHex}>${remaingPart}</color>`;
        this.questionRichText.string = textString;

    },

    onAnswerChanged(userText, editBoxObject) {
        this.setAnswer(userText);
        this.answerTextBox.setFocus();
    },

    setAnswer(answerText) {
        this.answer = answerText;
        this.checkAnswer();
    },

    checkAnswer() {
        let result = this.subCompare(this.answer, this.question, 1);
        if (result.found == 0) {
            this._updateQuestionUI("", this.question);
            return;
        }

        if (result.haystackIndex !== 0) {
            return;
        }

        let extract = this.extractStrings(this.question, result.substring);
        this._updateQuestionUI(extract.same, extract.diff);
        if (extract.diff == "") {
            this.mainController.onClickJump(this.question.length);
            if (this.nextOstacle < this.mainController.wordCount - 1) {
                this.nextOstacle += 1;
                this.questionRichText = this.obstacleLayoutList[this.nextOstacle].getChildByName('questionRichText').getComponent(cc.RichText);
                this.word = this.removeTags(this.questionRichText.string);
                //  let word = wordList.getRandomWord();
                this.setQuestion(this.word);
                this.answerTextBox.string = "";
            }
            //window.textbox = this.answerTextBox;


            //this.answerTextBox.focus();
        }
    },

    extractStrings(main, search) {

        var stringA = search;
        var stringB = main;
        var firstOccurrence = stringB.indexOf(stringA);

        var same = "";
        var diff = main;

        if (firstOccurrence === -1) {
            //alert('Search string Not found');
        } else {
            var stringALength = stringA.length;
            var newString;

            if (firstOccurrence === 0) {
                newString = stringB.substring(stringALength);
                same = search;
                diff = newString;
            } else {
                // do nothing if found in the middle
                newString = stringB.substring(0, firstOccurrence);
                newString += stringB.substring(firstOccurrence + stringALength);
            }

        }

        return {
            same: same,
            diff: diff
        };

    },

    subCompare(needle, haystack, min_substring_length) {

        // Min substring length is optional, if not given or is 0 default to 1:
        min_substring_length = min_substring_length || 1;

        // Search possible substrings from largest to smallest:
        for (var i = needle.length; i >= min_substring_length; i--) {
            for (var j = 0; j <= (needle.length - i); j++) {
                var substring = needle.substr(j, i);
                var k = haystack.indexOf(substring);
                if (k != -1) {
                    return {
                        found: 1,
                        substring: substring,
                        needleIndex: j,
                        haystackIndex: k
                    }
                }
            }
        }
        return {
            found: 0
        }
    },

    removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/(<([^>]+)>)/ig, '');
    },

    // update (dt) {},
});