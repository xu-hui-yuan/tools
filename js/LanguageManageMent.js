// 语言管理
import axiosBase from '@/assets/js/service/http/axiosBase';
import i18n from '@/assets/js/lang/i18n'; // 多语言

/**
 * 语言控制
 * 三个语言变量：系统语言(服务端默认语言) 本地语言(localStorage存储语言) 会话语言(sessionStorage存储语言)
 * 系统语言: 解决默认语言
 * 本地语言: 解决用户语言偏好记录
 * 会话语言: 解决当前展示语言刷新不丢失
 * 
 * 取值优先级: 会话语言 || 本地语言 || 系统语言
 */
export default class LanguageManageMent {
    static timer = null
    // 服务器存储的初始语言
    static serverInitLang = ''
    // 中文标记值
    static ChineseMark = 'zh-CN'
    // 英文标记值
    static EnglishMark = 'en-US'

    static localLang = 'localLang'
    static sessionLang = 'sessionLang'

    // 系统默认语言值加载到到本地内存
    static async set_http_serverDefaultLanguage() {
        // const res = await axiosBase.get('/languageManage/Language');
        const res = {
            data: {
                data: {
                    type: 'zh-CN'
                }
            }
        }
        LanguageManageMent.serverInitLang = res.data.data.type
    }

    // 更新 本地存储语言值
    static updateLocalStorageLanguage(lang) {
        localStorage.setItem(LanguageManageMent.localLang, lang)
    }
    // 更新 会话存储语言值
    static updateSessionStorageLanguage(lang) {
        sessionStorage.setItem(LanguageManageMent.sessionLang, lang)
    }

    // 获取 系统默认语言值
    static getServerDefaultLanguage() {
        return LanguageManageMent.serverInitLang
    }
    // 获取 本地存储语言值
    static getLocalStorageLanguage() {
        return localStorage.getItem(LanguageManageMent.localLang)
    }
    // 获取 会话存储语言值
    static getSessionStorageLanguage() {
        return sessionStorage.getItem(LanguageManageMent.sessionLang)
    }
    // 获取 应当使用的语言
    static getshouldUseLanguage() {
        // 会话存储的
        const sessionLang = LanguageManageMent.getSessionStorageLanguage()
        // 本地存储的
        const localLang = LanguageManageMent.getLocalStorageLanguage()
        // 服务器存储的
        const serverLang = LanguageManageMent.getServerDefaultLanguage()

        return sessionLang || localLang || serverLang
    }

    // 事件处理===================================================================================
    // 初始加载页面调用
    static async initEvent() {
        // 系统默认语言值加载到到本地内存
        await LanguageManageMent.set_http_serverDefaultLanguage()
        // 获取 应当使用的语言
        const shouldUseLanguage = LanguageManageMent.getshouldUseLanguage()
        // 更新 会话存储语言值 产生局部会话效果 注意：谷歌浏览器目前有个问题(edge, firfox 没有这个问题) 多次新开窗口，首次设置session变量后会丢失，所以下面加了 延时再次设置
        LanguageManageMent.updateSessionStorageLanguage(shouldUseLanguage)
        clearTimeout(LanguageManageMent.timer)
        LanguageManageMent.timer = setTimeout(()=> {
            LanguageManageMent.updateSessionStorageLanguage(shouldUseLanguage)
        }, 1000)
        // 设置 i18n 的语言
        i18n.locale = shouldUseLanguage
    }
    // 单点登录初始化
    static async initSSOEvent() {
        // 系统默认语言值加载到到本地内存
        await LanguageManageMent.set_http_serverDefaultLanguage()
        // 获取 系统默认语言
        const defaultLanguage = LanguageManageMent.getServerDefaultLanguage()
        // 更新 会话存储语言值 产生局部会话效果 注意：谷歌浏览器目前有个问题(edge, firfox 没有这个问题) 多次新开窗口，首次设置session变量后会丢失，所以下面加了 延时再次设置
        LanguageManageMent.updateSessionStorageLanguage(defaultLanguage)
        clearTimeout(LanguageManageMent.timer)
        LanguageManageMent.timer = setTimeout(()=> {
            LanguageManageMent.updateSessionStorageLanguage(defaultLanguage)
        }, 1000)

        // 获取 应当使用的语言
        const shouldUseLanguage = LanguageManageMent.getshouldUseLanguage()
         // 设置 i18n 的语言
        i18n.locale = shouldUseLanguage
    }
    // 修改语言调用
    static changeLanguageEvent(lang) {
        // 更新 会话存储语言值 产生局部会话效果
        LanguageManageMent.updateSessionStorageLanguage(lang)
        // 更新 本地存储语言值 产生记录用户最后行为记录效果
        LanguageManageMent.updateLocalStorageLanguage(lang)

        clearTimeout(LanguageManageMent.timer)
        window.location.reload();
    }
}