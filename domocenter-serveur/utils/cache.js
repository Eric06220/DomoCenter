function createTimedCache(durationMs = 10_000) {
  let data = null;
  let createdAt = 0;

  function isValid() {
    return (
      data !== null &&
      Date.now() - createdAt < durationMs
    );
  }

  function get() {
    return data;
  }

  function set(nextData) {
    data = nextData;
    createdAt = Date.now();
  }

  function clear() {
    data = null;
    createdAt = 0;
  }

  return {
    durationMs,
    isValid,
    get,
    set,
    clear,
  };
}

module.exports = {
  createTimedCache,
};
