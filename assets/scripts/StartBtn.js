cc.Class({
    extends: cc.Component,
    properties: {
        //score记分节点的关联引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
    },
    onMouseDown () {
        Global.num = 0
        cc.director.loadScene('game')
    },
    onMouseEnter (){
        this.node.opacity = 200
    },
    onMouseLeave (){
        this.node.opacity = 255
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scoreDisplay.string = `Score: ${Global.num}`
        this.node.on('mousedown',this.onMouseDown,this)
        this.node.on('mouseenter',this.onMouseEnter,this)
        this.node.on('mouseleave',this.onMouseLeave,this)
    },

    start () {

    },
    onDestroy () {
        this.node.off('mousedown',this.onMouseDown,this)
        this.node.off('mouseenter',this.onMouseEnter,this)
        this.node.off('mouseleave',this.onMouseLeave,this)
    }
    // update (dt) {},
});
