export function randomSleep(min, max) {
  const sleepTime = Math.random() * (max - min) + min;
  sleep(sleepTime);
}

export function generateRandomUser() {
  return {
      email: `user${Math.floor(Math.random() * 10000)}@example.com`,
      password: `pass${Math.floor(Math.random() * 10000)}`
  };
}

export function handleError(response, scenario) {
  if (response.status !== 200) {
      console.error(`${scenario} failed with status ${response.status}`);
      fail(`${scenario} failed`);
  }
}