// 路由队列管理
import baseRouter from '@/router/index';

class RouteQueueManageMent {
    // 路由队列
    routerQueue = []
    // 队列最大存储个数
    maxSize = 10
    // session存储的路由关键字
    sessionKey = 'routerSessionQueue'
    // 参数分隔符
    separator = '?'
    
    constructor() {
        this._updateThisQueue()
    }
    // 添加路由
    addRouter(fullPath) {
        const lastPath = this.routerQueue[this.routerQueue.length-1] || ''
        if(lastPath) { // 有上一个路由
            // 校验是否相同路由
            if(this._getOnlyRoutePath(fullPath) === this._getOnlyRoutePath(lastPath)) {
                this._replaceRoute(fullPath)
                return
            }
        }
        this._add(fullPath)
    }
    
    // 回退一个路由
    back(fn) {
        if(this.routerQueue.length == 0) {
            return
        }
        if(this.routerQueue.length == 1) {
            return
        }
    
        // 弹出当前路由
        this.routerQueue.pop()
        // 弹出前一个路由
        const beforeRoutePath = this.routerQueue.pop()
        // 同步路由变化到session中
        this._updateSessionQueue()

        if(!fn) {
            // 跳转
            baseRouter.push(beforeRoutePath)
        } else {
            // 传给回调  调用者自行跳转
            fn(beforeRoutePath)
        }
    }
    // 添加一个路由
    _add(fullPath) {
        this.routerQueue.push(fullPath)

        if(this.routerQueue.length > this.maxSize) {
            this.routerQueue = this.routerQueue.slice(this.routerQueue.length-this.maxSize, this.routerQueue.length)
        }

        this._updateSessionQueue()
    }
    // 同步路由变化到session中
    _updateSessionQueue() {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(this.routerQueue))
    }
    // 同步session到内存中
    _updateThisQueue() {
        try {
            const arrStr = sessionStorage.getItem(this.sessionKey)
            if(arrStr) {
                this.routerQueue = JSON.parse(arrStr)
            } else {
                this.routerQueue = []
            }
        } catch (error) {
            console.error(error, 'RouteQueueManageMent ERROR')
            this.routerQueue = []
        }
    }

    // 提取路由   从/operation-log?page=2&size=20  提取 /operation-log
    _getOnlyRoutePath(path) {
        const index = path.indexOf(this.separator)
        if(index===-1) return path
        return path.slice(0, index)
    }

    // 替换最后一个路由
    _replaceRoute(fullPath) {
        // 丢弃最后一个
        this.routerQueue.pop()
        // 添加一个路由
        this._add(fullPath)
    }
    
}




const RouteQueueSingLeton = new RouteQueueManageMent()
export default RouteQueueSingLeton