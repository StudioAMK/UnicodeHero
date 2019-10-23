cc.Class({
    extends: cc.Component,

    properties: {
        questionRichText: {
            default: null,
            type: cc.RichText,
        },

        answerBoxContainer: {
            default: null,
            type: cc.Node,
        },

        textColor: {
            type: cc.Color,
            default: cc.Color.BLACK,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    setUpGround(word, position, isRightOscatale) {
        let ObstacleCtrl = this;
        ObstacleCtrl.node.setPosition(position);
        let textString = `<color=#000000>${word}</color>`
        ObstacleCtrl.questionRichText.string = textString;
        let oneThirdWidth = ObstacleCtrl.node.width / 4;
        let editBoxPositionY = ObstacleCtrl.answerBoxContainer.y;
        ObstacleCtrl.editBoxPosition = cc.v2(position.x, position.y + editBoxPositionY);
        position.y = position.y - 30;
        if (isRightOscatale) {
            position.x = position.x + oneThirdWidth;

            ObstacleCtrl.landedPosition = position;
        } else {
            position.x = position.x - oneThirdWidth;

            ObstacleCtrl.landedPosition = position;
        }


    },

    start() {

    },

    getPosition() {
        let ObstacleCtrl = this;
        return ObstacleCtrl.landedPosition;
    },

    getEditBoxPosition() {
        let ObstacleCtrl = this;
        return ObstacleCtrl.editBoxPosition;
    },

    getRichTextWidth() {
        let ObstacleCtrl = this;
        return ObstacleCtrl.questionRichText.node.width;
    },


    // update (dt) {},
});