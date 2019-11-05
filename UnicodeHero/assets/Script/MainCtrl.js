const wordList = require("WordList");


cc.Class({
    extends: cc.Component,

    properties: {
        groundPrefab: {
            default: null,
            type: cc.Prefab,
        },

        character: {
            default: null,
            type: cc.Node,
        },

        obstacleLayout: {
            default: null,
            type: cc.Node,
        },

        mainCamera: {
            default: null,
            type: cc.Node,
        },

        scoreLabel: {
            default: null,
            type: cc.Label,
        },

        editBoxNode: {
            default: null,
            type: cc.Node,
        },

        timer: {
            default: null,
            type: cc.Label,
        },

        finishLayout: {
            default: null,
            type: cc.Node,
        },

        finishScoreLabel: {
            default: null,
            type: cc.Label,
        },

        finishTimeLabel: {
            default: null,
            type: cc.Label,
        },
        jumpAudioClip: {
            default: null,
            type: cc.AudioClip,
        },

        startLayout: {
            default: null,
            type: cc.Node,
        },

        touchEventNode: {
            default: null,
            type: cc.Node,
        },

        backgroundNode: {
            default: null,
            type: cc.Node,
        },

        wordCount: 18,


        frameNode: {
            default: null,
            type: cc.Node,
        },

        obstacleMaskNode: {
            default: null,
            type: cc.Node,
        },

        editBoxPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },  

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let MainCtrl = this;
    },

    setEditBoxFocus() {
        let MainCtrl = this;
        MainCtrl.editBoxAnswer.focus();
    },

    onKeyUp() {

    },

    start() {

    },

    startGame() {
        let MainCtrl = this;
        MainCtrl.init();
    },

    init() {
        let MainCtrl = this;
        MainCtrl.answerBox = cc.instantiate(MainCtrl.editBoxPrefab);
        MainCtrl.editBoxAnswer = MainCtrl.answerBox.getComponent(cc.EditBox);
        MainCtrl.touchEventNode.on('mousedown', MainCtrl.setEditBoxFocus, this);
        MainCtrl.answerBox.active = true;
        MainCtrl.backgroundNode.y = -320;
        MainCtrl.scoreLabel.string = "0";
        MainCtrl.timer.string = "00 : 00";
        MainCtrl.timeCount();
        MainCtrl.finishLayout.active = false;
        MainCtrl.startLayout.active = false;
        MainCtrl.nextGround = 0;
        MainCtrl.score = 0;
        MainCtrl.posY = 30;
        MainCtrl.mainCamera.position = cc.v2(0, 0);
        MainCtrl.character.position = cc.v2(-200, -280);
        MainCtrl.character.scaleX = 1;
        MainCtrl.obstacleLayout.removeAllChildren();
        MainCtrl.characterCtrl = MainCtrl.character.getComponent('CharacterCtrl');
        MainCtrl.answerBoxCtrl = MainCtrl.answerBox.getComponent('WordsChecker');
        MainCtrl.answerBoxCtrl.linkWithMainController(MainCtrl);
   
        MainCtrl.editBoxAnswer.string = "";
        MainCtrl.editBoxAnswer.placeholderLabel.string = "";
        MainCtrl.editBoxNode.addChild(MainCtrl.answerBox);
        MainCtrl.editBoxAnswer.focus();
        MainCtrl.setUpGround();
        MainCtrl.obstacleMaskNode.y = 0;
        MainCtrl.obstacleLayout.y = 0;
        MainCtrl.isJump = false;
    },

    setUpGround() {
        let MainCtrl = this;
        for (let i = 0; i < MainCtrl.wordCount; i++) {
            let word = wordList.getRandomWord();
            if (word == undefined) {
                word = wordList.getRandomWord();
            }
            let groundNode = cc.instantiate(MainCtrl.groundPrefab);
            MainCtrl.posX = 0;
            MainCtrl.isRightOstacle = true;
            if (i % 2 == 0) {
                MainCtrl.posX = 80;
                MainCtrl.isRightOstacle = true;
            } else {
                MainCtrl.posX = -80;
                MainCtrl.isRightOstacle = false;
            }
            let position = cc.v2(MainCtrl.posX, MainCtrl.posY)
            groundNode.getComponent('ObstacleCtrl').setUpGround(word, position, MainCtrl.isRightOstacle);
            MainCtrl.obstacleLayout.addChild(groundNode);
            MainCtrl.posY += 250;
        };
        MainCtrl.obstacleCtrl = MainCtrl.obstacleLayout.children[MainCtrl.nextGround].getComponent('ObstacleCtrl');
        let nextObstacleEditBoxPosition = MainCtrl.obstacleCtrl.getEditBoxPosition();
        let richTextWidth = MainCtrl.obstacleCtrl.getRichTextWidth();
        MainCtrl.answerBox.width = richTextWidth;
        MainCtrl.answerBox.position = nextObstacleEditBoxPosition;
        MainCtrl.answerBoxCtrl.init(MainCtrl.obstacleLayout.children, MainCtrl);
    },

    onClickJump(score) {
        let MainCtrl = this;
        cc.audioEngine.play(MainCtrl.jumpAudioClip, false, 1);
        MainCtrl.moveBackground();
        MainCtrl.distance = 0;
        MainCtrl.isJump = true;
        MainCtrl.obstaclePosition = MainCtrl.obstacleCtrl.getPosition();
        let moveCharacter = cc.jumpTo(0.5, MainCtrl.obstaclePosition, 200, 1);
        let moveCamera = cc.moveTo(0.5, cc.v2(0, MainCtrl.mainCamera.y + 250));
        let moveOstacleMask = cc.moveTo(0.5, cc.v2(0, MainCtrl.obstacleMaskNode.y + 250));
        let moveOstacleLayout = cc.moveTo(0.5, cc.v2(0, MainCtrl.obstacleLayout.y - 250));
        MainCtrl.character.runAction(moveCharacter);
        MainCtrl.mainCamera.runAction(moveCamera);
        MainCtrl.obstacleMaskNode.runAction(moveOstacleMask);
        MainCtrl.obstacleLayout.runAction(moveOstacleLayout);
        MainCtrl.characterCtrl.playJumpAnim();
        MainCtrl.score += score;
        MainCtrl.scoreLabel.string = MainCtrl.score;
        MainCtrl.scheduleOnce(MainCtrl.jumpCallBack, 0.5);
        if (MainCtrl.nextGround < MainCtrl.wordCount - 1) {
            MainCtrl.nextGround += 1;
            MainCtrl.obstacleCtrl = MainCtrl.obstacleLayout.children[MainCtrl.nextGround].getComponent('ObstacleCtrl');
            let nextObstacleEditBoxPosition = MainCtrl.obstacleCtrl.getEditBoxPosition();
            let richTextWidth = MainCtrl.obstacleCtrl.getRichTextWidth();
            MainCtrl.answerBox.width = richTextWidth;
            MainCtrl.answerBox.position = nextObstacleEditBoxPosition;
            MainCtrl.answerBox.y = MainCtrl.answerBox.y - 250;
        } else {
            clearInterval(MainCtrl.x);
            MainCtrl.finishLayout.active = true;
            MainCtrl.editBoxAnswer.string = '';
            MainCtrl.answerBox.destroy();
            MainCtrl.finishScoreLabel.string = "Total Score - " + MainCtrl.score;
            MainCtrl.finishTimeLabel.string = "Finish Time - " + MainCtrl.minutes + " mins" + " : " + MainCtrl.seconds + " seconds";
   
         
        }

    },

    timeCount() {
        let MainCtrl = this;
        MainCtrl.seconds = 0;
        MainCtrl.minutes = 0;
        var totalSeconds = 0;
        MainCtrl.x = setInterval(setTime, 1000);

        function setTime() {
            ++totalSeconds;
            MainCtrl.seconds = pad(totalSeconds % 60);
            MainCtrl.minutes = pad(parseInt(totalSeconds / 60));
            MainCtrl.timer.string = MainCtrl.minutes + " : " + MainCtrl.seconds;
        }

        function pad(val) {
            var valString = val + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        }

    },

    jumpCallBack() {
        let MainCtrl = this;
        MainCtrl.character.scaleX = MainCtrl.character.scaleX * -1;
    },

    //update(dt) {},

    restartGame() {
        let MainCtrl = this;
        MainCtrl.init();
    },

    moveBackground() {
        let MainCtrl = this;
        let moveBackground = cc.moveTo(0.5, cc.v2(0, MainCtrl.backgroundNode.y - 50));
        MainCtrl.backgroundNode.runAction(moveBackground);
    },
});