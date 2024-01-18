const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

const { join } = require("path");

const { fork: forkChildProcess } = require("child_process");
const cluster = require("cluster");

(async () => {
  const createThreadedFunction =
    (func) =>
    (...args) =>
      new Promise((resolve, reject) => {
        new Worker(join(__dirname, "worker.js"), {
          workerData: { func: func.toString(), args },
          resourceLimits: { cpu: 2 },
        })
          .on("message", resolve)
          .on("error", reject)
          .on("exit", (code) => {
            if (code)
              reject(new Error(`Worker stopped with exit code ${code}`));
          });
      }).catch((error) => console.log({ error }));

  const createClusterFunction =
    (func) =>
    (...args) => {
      console.log({ cluster, clusterFork: cluster.fork });
      return new Promise((resolve, reject) => {
        if (cluster.isMaster) {
          const worker = cluster
            .fork()
            .on("message", resolve)
            .on("error", reject)
            .on("exit", (code) => {
              if (code)
                reject(new Error(`Worker stopped with exit code ${code}`));
            });
          worker.send({ func: func.toString(), args });
        }
      }).catch((error) => console.log({ error }));
    };

  const createChildProcessFunction =
    (func) =>
    (...args) =>
      new Promise((resolve, reject) => {
        const child = forkChildProcess(join(__dirname, "child.js"))
          .on("message", resolve)
          .on("error", reject)
          .on("exit", (code) => {
            if (code)
              reject(new Error(`Worker stopped with exit code ${code}`));
          });
        child.send({ func: func.toString(), args });
      }).catch((error) => console.log({ error }));

  const blockingWithForPromiseBuilder = () => {
    // blocking
    for (let i = 0; i < 1000000000; i++) {
      if (i % 100000000 === 0) {
        console.log(`blockingWithForPromiseBuilder: ${i}`);
      }
    }
    console.log(`blockingWithForPromiseBuilder: done`);
  };

  const blockingWithForPromiseBuilderSmall = () => {
    // blocking
    for (let i = 0; i < 10; i++) {
      console.log(`blockingWithForPromiseBuilderSmall: ${i}`);
    }
    console.log(`blockingWithForPromiseBuilderSmall: done`);
  };

  const blockingWithMapPromiseBuilder = () => {
    // blocking and exploding
    Array(100000)
      .fill(0)
      .map((_, i) => {
        if (i % 1000 === 0) {
          console.log(`blockingWithMapPromiseBuilder: ${i}`);
        }
        return 0;
      });
    console.log(`blockingWithMapPromiseBuilder: done`);
  };

  const blockingWithForeachPromiseBuilder = () => {
    // blocking
    Array(100000)
      .fill(0)
      .forEach((_, i) => {
        if (i % 1000 === 0) {
          console.log(`blockingWithForeachPromiseBuilder: ${i}`);
        }
      });
    console.log(`blockingWithForeachPromiseBuilder: done`);
  };

  const blockingWithWhilePromiseBuilder = () => {
    // blocking
    let i = 0;
    while (i < 1000000000) {
      if (i % 100000000 === 0) {
        console.log(`blockingWithWhilePromiseBuilder: ${i}`);
      }
      i++;
    }
    console.log(`blockingWithWhilePromiseBuilder: done`);
  };

  const blockingWithFilterPromiseBuilder = () => {
    // blocking
    Array(100000)
      .fill(0)
      .filter((_, i) => {
        if (i % 1000 === 0) {
          console.log(`blockingWithFilterPromiseBuilder: ${i}`);
        }
        return true;
      });
    console.log(`blockingWithFilterPromiseBuilder: done`);
  };

  // NOTE: workers are blocking each other. Try to use childProccess or cluster instead

  // createThreadedFunction(blockingWithForPromiseBuilder)()
  // console.log('for unblocked')

  // createThreadedFunction(blockingWithWhilePromiseBuilder)()
  // console.log('while unblocked')

  // createThreadedFunction(blockingWithMapPromiseBuilder)()
  // console.log('map unblocked')

  // createThreadedFunction(blockingWithForeachPromiseBuilder)()
  // console.log('foreach unblocked')

  // createThreadedFunction(blockingWithFilterPromiseBuilder)()
  // console.log('filter unblocked')

  // createThreadedFunction(blockingWithForPromiseBuilderSmall)()
  // console.log('forSmall unblocked')

  // NOTE: setImmediate is not working is being blocked by the main thread

  // setImmediate(createThreadedFunction(blockingWithForPromiseBuilder));
  // console.log("for unblocked");
  // setImmediate(createThreadedFunction(blockingWithWhilePromiseBuilder));
  // console.log("while unblocked");
  // setImmediate(createThreadedFunction(blockingWithMapPromiseBuilder));
  // console.log("map unblocked");
  // setImmediate(createThreadedFunction(blockingWithForeachPromiseBuilder));
  // console.log("foreach unblocked");
  // setImmediate(createThreadedFunction(blockingWithFilterPromiseBuilder));
  // console.log("filter unblocked");
  // setImmediate(createThreadedFunction(blockingWithForPromiseBuilderSmall));
  // console.log("forSmall unblocked");

  // createChildProcessFunction(blockingWithForPromiseBuilder)();
  // console.log("for unblocked");
  // createChildProcessFunction(blockingWithWhilePromiseBuilder)();
  // console.log("while unblocked");
  // createChildProcessFunction(blockingWithForeachPromiseBuilder)();
  // console.log("foreach unblocked");
  // createChildProcessFunction(blockingWithMapPromiseBuilder)();
  // console.log("map unblocked");
  // createChildProcessFunction(blockingWithFilterPromiseBuilder)();
  // console.log("filter unblocked");
  // createChildProcessFunction(blockingWithForPromiseBuilderSmall)();
  // console.log("forSmall unblocked");

  // console.time("sync");
  // blockingWithForPromiseBuilderSmall();
  // blockingWithForPromiseBuilder();
  // blockingWithWhilePromiseBuilder();
  // blockingWithMapPromiseBuilder();
  // blockingWithForeachPromiseBuilder();
  // blockingWithFilterPromiseBuilder();
  // console.timeEnd("sync");

  // NOTE: childProcess is works very well

  // console.time("childProcess.all");
  // const blockingWithForPromiseBuilderSmallPromise = createChildProcessFunction(
  //   blockingWithForPromiseBuilderSmall
  // )();
  // const blockingWithForPromiseBuilderPromise = createChildProcessFunction(
  //   blockingWithForPromiseBuilder
  // )();
  // const blockingWithWhilePromiseBuilderPromise = createChildProcessFunction(
  //   blockingWithWhilePromiseBuilder
  // )();
  // const blockingWithMapPromiseBuilderPromise = createChildProcessFunction(
  //   blockingWithMapPromiseBuilder
  // )();
  // const blockingWithForeachPromiseBuilderPromise = createChildProcessFunction(
  //   blockingWithForeachPromiseBuilder
  // )();
  // const blockingWithFilterPromiseBuilderPromise = createChildProcessFunction(
  //   blockingWithFilterPromiseBuilder
  // )();

  // const memoryUsageChildProcess = process.memoryUsage();
  // await Promise.all([
  //   blockingWithForPromiseBuilderSmallPromise,
  //   blockingWithForPromiseBuilderPromise,
  //   blockingWithWhilePromiseBuilderPromise,
  //   blockingWithMapPromiseBuilderPromise,
  //   blockingWithForeachPromiseBuilderPromise,
  //   blockingWithFilterPromiseBuilderPromise,
  // ]);
  // console.timeEnd("childProcess.all");

  // const memoryUsageChildProcessFormated = Object.keys(
  //   memoryUsageChildProcess
  // ).reduce(
  //   (acc, key) => ({
  //     ...acc,
  //     [key]: `${(memoryUsageChildProcess[key] / 1024 / 1024).toFixed(2)} MB`,
  //   }),
  //   {}
  // );

  // console.log({ memoryUsageChildProcessFormated });

  // NOTE: cluster is works very well

  console.time("cluster.all");
  const blockingWithForPromiseBuilderSmallPromise = createClusterFunction(
    blockingWithForPromiseBuilderSmall,
  )();
  // const blockingWithForPromiseBuilderPromise = createClusterFunction(
  //   blockingWithForPromiseBuilder
  // )();
  // const blockingWithWhilePromiseBuilderPromise = createClusterFunction(
  //   blockingWithWhilePromiseBuilder
  // )();
  // const blockingWithMapPromiseBuilderPromise = createClusterFunction(
  //   blockingWithMapPromiseBuilder
  // )();
  // const blockingWithForeachPromiseBuilderPromise = createClusterFunction(
  //   blockingWithForeachPromiseBuilder
  // )();
  // const blockingWithFilterPromiseBuilderPromise = createClusterFunction(
  //   blockingWithFilterPromiseBuilder
  // )();

  const memoryUsageCluster = process.memoryUsage();
  await Promise.all([
    blockingWithForPromiseBuilderSmallPromise,
    // blockingWithForPromiseBuilderPromise,
    // blockingWithWhilePromiseBuilderPromise,
    // blockingWithMapPromiseBuilderPromise,
    // blockingWithForeachPromiseBuilderPromise,
    // blockingWithFilterPromiseBuilderPromise,
  ]);
  console.timeEnd("cluster.all");

  const memoryUsageChildProcessFormated = Object.keys(
    memoryUsageCluster,
  ).reduce(
    (acc, key) => ({
      ...acc,
      [key]: `${(memoryUsageCluster[key] / 1024 / 1024).toFixed(2)} MB`,
    }),
    {},
  );

  console.log({ memoryUsageChildProcessFormated });

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
})();
