import _ from 'lodash'

var EventEmitter2 = require('eventemitter2').EventEmitter2;

export function createCircuit(circuit_key){
    return require('./circuits/' + circuit_key + '.js').default
}

class FastWhaleCall extends EventEmitter2 {
    constructor(circuit, config){
        super()
        this.circuit = this.createCircuit(circuit, config)
        this.observer()
    }

    createCircuit(circuit, config){
        let useCallback = require('./circuits/' + circuit + '.js').default
        return useCallback(this, config)
    }

    observer(){
        let _this = this;
        ['dialout', 'outbound', 'hangup'].forEach(action => {
            Object.defineProperty(this, action, {
                get(){
                    return function(){
                        return _this.circuit[action](...arguments)
                    }
                }
            })
        })
    }
}

export default FastWhaleCall