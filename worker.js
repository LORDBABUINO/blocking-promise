const { parentPort, workerData } = require('worker_threads')

;(() => {
    const result = new Function(`return ${workerData.func}`)()(...workerData.args)
    parentPort.postMessage(result)
})()
