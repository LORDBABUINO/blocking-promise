const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('worker_threads')
const { join } = require('path')
;(async () => {
  const createThreadedFunction =
    (func) =>
    (...args) =>
      new Promise((resolve, reject) => {
        new Worker(join(__dirname, 'worker.js'), {
          workerData: { func: func.toString(), args },
          resourceLimits: { cpu: 2 },
        })
          .on('message', resolve)
          .on('error', reject)
          .on('exit', (code) => {
            if (code) reject(new Error(`Worker stopped with exit code ${code}`))
          })
      }).catch((error) => console.log({ error }))
  // isMainThread
  //   ? new Promise((resolve, reject) => {
  //       new Worker(join(__dirname, 'worker.js'), {
  //         workerData: { func: func.toString(), args },
  //       })
  //         .on('message', resolve)
  //         .on('error', reject)
  //         .on('exit', (code) => {
  //           if (code)
  //             reject(new Error(`Worker stopped with exit code ${code}`))
  //         })
  //     }).catch((error) => console.log({ error }))
  //   : parentPort.postMessage(
  //       new Function('return ' + workerData.func)()(...args),
  //     )

  const blockingWithForPromiseBuilder = () => {
    // blocking
    for (let i = 0; i < 1000000000; i++) {
      if (i % 100000000 === 0) {
        console.log(`blockingWithForPromiseBuilder: ${i}`)
      }
    }
    console.log(`blockingWithForPromiseBuilder: done`)
  }

  const blockingWithForPromiseBuilderSmall = () => {
    // blocking
    for (let i = 0; i < 10; i++) {
      console.log(`blockingWithForPromiseBuilderSmall: ${i}`)
    }
    console.log(`blockingWithForPromiseBuilderSmall: done`)
  }

  const blockingWithMapPromiseBuilder = () => {
    // blocking and exploding
    Array(100000)
      .fill(0)
      .map((_, i) => {
        if (i % 10000 === 0) {
          console.log(`blockingWithMapPromiseBuilder: ${i}`)
        }
        return 0
      })
    console.log(`blockingWithMapPromiseBuilder: done`)
  }

  const blockingWithForeachPromiseBuilder = () => {
    // blocking
    Array(100000)
      .fill(0)
      .forEach((_, i) => {
        if (i % 10000 === 0) {
          console.log(`blockingWithForeachPromiseBuilder: ${i}`)
        }
      })
    console.log(`blockingWithForeachPromiseBuilder: done`)
  }

  const blockingWithWhilePromiseBuilder = () => {
    // blocking
    let i = 0
    while (i < 1000000000) {
      if (i % 100000000 === 0) {
        console.log(`blockingWithWhilePromiseBuilder: ${i}`)
      }
      i++
    }
    console.log(`blockingWithWhilePromiseBuilder: done`)
  }

  const blockingWithFilterPromiseBuilder = () => {
    // blocking
    Array(100000)
      .fill(0)
      .filter((_, i) => {
        if (i % 10000 === 0) {
          console.log(`blockingWithFilterPromiseBuilder: ${i}`)
        }
        return true
      })
    console.log(`blockingWithFilterPromiseBuilder: done`)
  }

  createThreadedFunction(blockingWithForPromiseBuilder)()
  console.log('for unblocked')

  createThreadedFunction(blockingWithWhilePromiseBuilder)()
  console.log('while unblocked')

  createThreadedFunction(blockingWithMapPromiseBuilder)()
  console.log('map unblocked')

  createThreadedFunction(blockingWithForeachPromiseBuilder)()
  console.log('foreach unblocked')

  createThreadedFunction(blockingWithFilterPromiseBuilder)()
  console.log('filter unblocked')

  createThreadedFunction(blockingWithForPromiseBuilderSmall)()
  console.log('forSmall unblocked')

  // NOTE: workers are blocking each other. Try to use childProccess instead

  // await Promise.all([
  //   createThreadedFunction(blockingWithForPromiseBuilder)(),
  //   createThreadedFunction(blockingWithWhilePromiseBuilder)(),
  //   createThreadedFunction(blockingWithMapPromiseBuilder)(),
  //   createThreadedFunction(blockingWithForeachPromiseBuilder)(),
  //   createThreadedFunction(blockingWithFilterPromiseBuilder)(),
  //   createThreadedFunction(blockingWithForPromiseBuilderSmall)(),
  // ])

  // console.log('promise.all')

  // async function loop1() {
  //   for (var i = 10000; i < 20000; i++) {
  //     console.log(i)
  //   }
  // }
  // async function loop2() {
  //   for (var i = 0; i < 10000; i++) {
  //     console.log(i)
  //   }
  // }
  // loop1()
  // loop2()
})()
