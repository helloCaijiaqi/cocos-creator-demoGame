//自定义js模块 
//如果自定义的模块 是cc.Componet 或者是 cc.Class 定义的对象，则不用手动module.exports ，creator会自己帮我们导出
let message = {
    content : 'Hello World'
}
module.exports = message