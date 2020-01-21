cc.Class({
    extends: cc.Component,
    properties: {
        //跳跃高度
        jumpHeight: 0,
        //跳跃间隔时间
        jumpDuration: 0,
        //最大水平移动速度
        maxMoveSpeed: 0,
        //水平移动加速度
        xAccel: 0,
        //当前水平移动速度
        xSpeed:  {
            default: 0,
            visible: false
        },
        //左边加速度开关
        accLeftSwitch: {
            default: false,
            visible: false
        },
        //右边加速度开关
        accRightSwitch: {
            default: false,
            visible: false
        },
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        }
    },
    setJumpAction () {
        //上升action对象
        let jumpUp = cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionInOut())
        //下降action对象
        let jumpDown = cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionInOut())
        //动作序列完成后的声音回调函数 --> 通过cc.callFunc把函数转换成动作 cc.sequence只接受动作对象
        let jumpAudioCallbackFn = cc.callFunc(this.palyJumpAudio,this)
        //返回会不断重复的动作序列的action对象
        let actionRepeatSequence = cc.repeatForever(cc.sequence(jumpUp,jumpDown,jumpAudioCallbackFn))
        return actionRepeatSequence
    },
    //声音播放函数
    palyJumpAudio () {
        cc.audioEngine.playEffect(this.jumpAudio,false)
    },
    //onKeyD&U Actions powerBy JS (e --> event obj)
    onKeyDown (e) {
        switch(e.keyCode){
            case cc.macro.KEY.a :
                this.accLeftSwitch = true
                break
            case cc.macro.KEY.d :
                this.accRightSwitch = true
                break
        }
    },

    onKeyUp (e) {
        switch(e.keyCode){
            case cc.macro.KEY.a :
                this.accLeftSwitch = false
                break
            case cc.macro.KEY.d :
                this.accRightSwitch = false
                break
        }
    },

    initPlayerActions () {
        //给组件对象初始化一个跳跃动作的属性对象
        this.jumpAction = this.setJumpAction()
        //给组件绑定的节点赋予动作 => 给runAction赋予动作对象
        //这里的node其实是cc.Node类的实例,每个组件都会关联cocos的Node类对象
        this.node.runAction(this.jumpAction)
        //初始化键盘输入监听，给组件绑定事件监听 参数：1要监听的事件类型 2需要执行的监听函数 3进行绑定的目标组件
        //注意cc.systemEvent是cc.SystemEvent类的单个实例 => 单例的抽出，方便于全局使用
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this) //这里有bug info：The listener has been registered, please don't register it again 
        //提前销毁也没有用，黑魔法确认
    },

    destroyKeyEvent () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this)
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this)
    },

    // LIFE-CYCLE CALLBACKS:

    //生命周期的初始化函数，有关节点的初始化操作在此完成
    //初始化自动执行的函数
    onLoad () {
        //初始化player
        this.initPlayerActions()
    },

    start () {

    },
    //每帧动画都会执行的生命周期函数
    update (dt) {
        if(this.accLeftSwitch){
            this.xSpeed -= this.xAccel * dt
        }else if(this.accRightSwitch){
            this.xSpeed += this.xAccel * dt
        }
        //设置速度绝对值不超过最大速度
        if(Math.abs(this.xSpeed) > this.maxMoveSpeed){
            //记得要恢复速度的方向 --> 正负号
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
        }
        //更新节点位置
        this.node.x += this.xSpeed * dt
        //限制player位置在Canvas内
        if(Math.abs(this.node.x)>440){
            this.node.x = 440 * this.node.x / Math.abs(this.node.x)
        }
    },
    //组件销毁时，执行的生命周期函数
    onDestroy () {
        this.destroyKeyEvent()
    }
});


