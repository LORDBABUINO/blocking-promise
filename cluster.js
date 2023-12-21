process.on("message", ({ func, args }) => {
  const result = new Function("return " + func)()(...args);
  process.send(result ?? "done");
  process.exit(0);
}
