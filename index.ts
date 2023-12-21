(async () => {
  const blockingWithForPromiseBuilder = async () => {
    // blocking
    for (let i = 0; i < 1000000000; i++) {
      if (i % 100000000 === 0) {
        console.log(`blockingPromiseBuilder: ${i}`);
      }
    }
    console.log(`blockingWithForPromiseBuilder: done`);
  };

  const blockingWithMapPromiseBuilder = async () => {
    // blocking and exploding
    Array(100000)
      .fill(0)
      .map((_, i) => {
        if (i % 10000 === 0) {
          console.log(`blockingPromiseBuilder: ${i}`);
        }
        return 0;
      });
    console.log(`blockingWithMapPromiseBuilder: done`);
  };

  const blockingWithForeachPromiseBuilder = async () => {
    // blocking
    Array(100000)
      .fill(0)
      .forEach((_, i) => {
        if (i % 10000 === 0) {
          console.log(`blockingPromiseBuilder: ${i}`);
        }
      });
    console.log(`blockingWithForeachPromiseBuilder: done`);
  };

  const blockingWithWhilePromiseBuilder = async () => {
    // blocking
    let i = 0;
    while (i < 1000000000) {
      if (i % 100000000 === 0) {
        console.log(`blockingPromiseBuilder: ${i}`);
      }
      i++;
    }
    console.log(`blockingWithWhilePromiseBuilder: done`);
  };

  const blockingWithFilterPromiseBuilder = async () => {
    // blocking
    Array(100000)
      .fill(0)
      .filter((_, i) => {
        if (i % 10000 === 0) {
          console.log(`blockingPromiseBuilder: ${i}`);
        }
        return true;
      });
    console.log(`blockingWithFilterPromiseBuilder: done`);
  };

  blockingWithForPromiseBuilder();
  console.log("for unblocked");

  blockingWithMapPromiseBuilder();
  console.log("map unblocked");

  blockingWithForeachPromiseBuilder();
  console.log("foreach unblocked");

  blockingWithWhilePromiseBuilder();
  console.log("while unblocked");

  blockingWithFilterPromiseBuilder();
  console.log("filter unblocked");
})();
