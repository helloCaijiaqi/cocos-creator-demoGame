cc.Class({
    extends: cc.Component,
    properties: {
        pickRadius: 0,
        addOnePrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    getPlayerDistance () {
        //获取player节点位置坐标
        // console.log(this.game)
        let palyerPosition = this.game.player.getPosition()
        //计算star节点和player节点之间的距离
        let dist = this.node.position.sub(palyerPosition).mag()
        //返回距离结果
        return dist
    },
    //函数判断星星是否被拾取
    onPicked () {
        //创建+1节点
        let newAddOne = cc.instantiate(this.addOnePrefab)
        //将新节点添加到star节点下
        this.game.node.addChild(newAddOne)
        console.log('ok')
        //设置+1节点位置
        newAddOne.setPosition(this.node.getPosition())
        //设置+1节点动作
        let finishCallbackFn = cc.callFunc(()=>{
            newAddOne.destroy()
        },this)
        let addOneAction = cc.moveBy(1,cc.v2(0,100)).easing(cc.easeCubicActionInOut())
        let addOneActionSequence = cc.sequence(addOneAction,finishCallbackFn)
        newAddOne.runAction(addOneActionSequence)
        //调用game组件里的方法spawnNewStar()生成一个新的星星节点
        this.game.spawnNewStar()
        //调用game中的gainScore获取分数
        this.game.gainScore()
        //重置game里的timer
        this.game._timer = 0
        //销毁当前的星星节点   注意顺序：如果执行销毁后则不能再获取当前的星星节点
        this.node.destroy()
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },
    start () {

    },
    update (dt) {
        // 每帧判断星星和主角之间的距离是否小于收集距离
        if(this.getPlayerDistance() < this.pickRadius){
            //调用拾取函数
            this.onPicked()
        }
        //调用game的计时器来每帧时间内更新星星透明度
        let opacityRatio = 1 - this.game._timer / this.game._timeOut 
        let minOpacity = 50
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))
    },
});
