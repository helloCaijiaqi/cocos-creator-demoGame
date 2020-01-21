//导入自定义js模块
let message = require('MessageModule')
cc.Class({
    extends: cc.Component,
    properties: {
        //星星消失间隔时间

        //最大间隔时间
        maxStarDuration: 0,
        //最小间隔时间
        minStarDuration: 0,
        //下面均是properties定义的完整写法，default是默认值，type是属性类型

        //starPrefab用于关联星星预制资源 
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        //ground用于关联地面子节点，用于确定星星的高度
        ground: {
            default: null,
            type: cc.Node
        },
        //player用于关联角色子节点，用于确定角色高度
        player: {
            default: null,
            type: cc.Node
        },
        //score记分节点的关联引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        //得分音效
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        //得分计数
        _score: 0,
        //计时器的定义
        _timer: 0,
        //过期时间定义
        _timerOut: 0
    },

    //生成星星的函数
    spawnNewStar () {
        //使用预制资源生成一个新节点
        let newStar = cc.instantiate(this.starPrefab)
        //将新节点添加到Canvas节点下
        this.node.addChild(newStar)
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition())
        //将game组件传递给star子节点上的组件
        newStar.getComponent('Star').game = this
    },
    //开始游戏按钮
    spawnNewStartBtn () {
        //使用预制资源生成一个新节点
        let newStartBtn = cc.instantiate(this.startBtnPrefab)
        //将新节点添加到Canvas节点下
        this.node.addChild(newStartBtn)
        //设置按钮位置
        newStartBtn.setPosition(cc.v2(0,100))
        //将game组件传递给starBtn子节点上的组件
        newStartBtn.getComponent('StartBtn').game = this
    },
    //生成随机位置的2维坐标对象
    getNewStarPosition () {
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标 

        // 地面节点的 y 轴坐标  --> ground.y是节点锚点y坐标，要获取到地表面的位置需在加上1/2地面高度
        let groundY = this.ground.y + this.ground.height/2
        //通过节点的getComponent()方法获取节点上挂载的组件，再获取组件属性jumpHeight值
        //Math.random()会从0~1变动
        let randY = groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标   
        let randX = (Math.random() - 0.5) * this.node.width;
        // 返回星星坐标
        return cc.v2(randX, randY)
    },

    //分数的更新
    gainScore () {
        Global.num += 1
        this.scoreDisplay.string = `Score: ${Global.num}`
        //每次更新score都播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    //游戏失败
    gameOver () {
        cc.director.loadScene('gameOver')
    },
    //初始化游戏
    initGame () {
        //生成一个新的星星
        this.spawnNewStar()
        //初始化过期时间 --> 随机生成一个过期时间
        this._timeOut = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
        //设置常驻节点
        cc.game.addPersistRootNode(this.scoreDisplay);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        //获取MessageModule模块信息
        cc.log(message.content)
        //初始化游戏
        this.initGame()
    },
    start () {

    },

    update (dt) {
        //判断是否已经过期
        if(this._timer > this._timeOut){
            //判定游戏失败
            this.gameOver()
            return
        }
        this._timer += dt
    },
});
