cc.Class({
    extends: cc.Component,

    properties: {

        profileFace: {
            default: null,
            type: cc.Sprite,
        },

        jumpSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },

        characterSuit: {
            default: null,
            type: cc.Node,
        },

        profileImg: {
            default: null,
            type: cc.Node,
        },

        profileAnim: {
            default: null,
            type: cc.Animation,
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let CharacterCtrl = this;
        CharacterCtrl.init();

    },

    init() {
        let CharacterCtrl = this;
        // let imgUrl = "http://avatar.shankoemee.com/avatar2/" + user_ID + ".png";
        // cc.loader.load(imgUrl, (err, texture) => {
        //     CharacterCtrl.profileFace.spriteFrame = new cc.SpriteFrame(texture);
        // });
        CharacterCtrl.characterSuitAnim = CharacterCtrl.characterSuit.getComponent(cc.Animation);
        CharacterCtrl.charaterSuitSprite = CharacterCtrl.characterSuit.getComponent(cc.Sprite);

    },

    start() {

    },

    playIdleAnim() {
        let CharacterCtrl = this;
        CharacterCtrl.profileImg.scaleX = CharacterCtrl.profileImg.scaleX * -1;
        CharacterCtrl.characterSuitAnim.play('idleAnim');
        CharacterCtrl.profileAnim.play('profilePicAnim');
        CharacterCtrl.profileImg.position = cc.v2(0, 182);

    },

    playJumpAnim() {
        let CharacterCtrl = this;
        CharacterCtrl.characterSuitAnim.stop('idleAnim');
        CharacterCtrl.profileAnim.stop('profilePicAnim');
        CharacterCtrl.profileImg.position = cc.v2(-10, 220);
        CharacterCtrl.charaterSuitSprite.spriteFrame = CharacterCtrl.jumpSpriteFrame;
        CharacterCtrl.scheduleOnce(CharacterCtrl.playIdleAnim, 0.5);

    },


    // update (dt) {},
});