export const options = {
  scenarios: {
      smoke: {
          executor: 'constant-vus',
          vus: 1,
          duration: '20s',
      },
      load: {
          executor: 'ramping-vus',
          startVUs: 0,
          stages: [
              { duration: '10s', target: 50 },
              { duration: '10s', target: 50 },
              { duration: '10s', target: 0 },
          ],
      },
  },
  thresholds: {
      http_req_duration: ['p(95)<500'],
      http_req_failed: ['rate<0.01'],
  },
};