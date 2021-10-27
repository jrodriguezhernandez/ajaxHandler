class AjaxHandler {
    constructor() {
    }

    /**
     * Retorna un objeto que funciona para hacer una petición tipo POST
     * @param object params Objeto con los parametros
     * @returns {{beforeSend: ((function(*): (*))|*), data, type, url}}
     */
    #_getConfigPost(params) {
        let callBackExists = params.hasOwnProperty("callBackBeforeSend")
        return {
            "type": params.type,
            "url": params.url,
            "data": params.data,
            "beforeSend": (xhr) => {
                xhr.setRequestHeader('X-CSRF-Token', app.csrfToken)
                callBackExists ? params.callBackBeforeSend({}) : this.callBackDefault({"text": 'postBeforeSendDefault'})
            }
        }
    }

    /**
     * Retorna un objeto que funciona para hacer una petición tipo GET
     * @param object params Objeto con los parametros
     * @returns {{beforeSend: ((function(*): (*))|*), data, type, url}}
     */
    #_getConfigGet(params) {
        let callBackExists = params.hasOwnProperty("callBackBeforeSend")
        return {
            "type": params.type,
            "url": params.url,
            "beforeSend": (xhr) => callBackExists ? params.callBackBeforeSend({}) : this.callBackDefault({"text": 'getBeforeSendDefault'})
        }
    }

    /**
     * Retorna un objeto para hacer petición
     * @param object params Objeto con los parametros
     * @returns {{beforeSend: ((function(*): (*))|*), data, type, url}}
     */
    #_getConfig(params) {
        if (params.type === 'POST') return this.#_getConfigPost(params)
        if (params.type === 'GET') return this.#_getConfigGet(params)
    }

    /**
     * Se encarga de ejecutar las peticiones ajax
     * @param object params Objeto con los parametros
     */
    execute(params) {
        let that = this
        let callBackSuccessExists = params.hasOwnProperty("callBackSuccess")
        let callBackFailExists = params.hasOwnProperty("callBackFail")

        jQuery.ajax(this.#_getConfig(params)).done(response => {
            return callBackSuccessExists ? params.callBackSuccess(response) : that.callBackDefault(response)
        }).fail(response => {
            return callBackFailExists ? params.callBackFail(response) : that.callBackDefault(response)
        })
    }

    callBackDefault(params) {
        // app.debug(params)
    }
}
