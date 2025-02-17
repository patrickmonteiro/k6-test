export const options = {
  scenarios: {
    smoke: {
        executor: 'constant-vus',
        vus: 5,
        duration: '1m',
    },
    average_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        // Ramp-up (subida gradual)
        { duration: '1m', target: 100 },  // Subir para 100 VUs em 1 minuto
        // Platô (carga estável)
        { duration: '3m', target: 100 },  // Manter 100 VUs por 3 minutos
        // Ramp-down (descida gradual)
        { duration: '1m', target: 0 }     // Reduzir para 0 VUs em 1 minuto
      ],
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        // Ramp-up (subida gradual)
        { duration: '3m', target: 10000 },  // Subir para 10.000 VUs em 3 minutos
        // Platô (carga máxima)
        { duration: '5m', target: 10000 },  // Manter 10.000 VUs por 5 minutos
        // Ramp-down (descida gradual)
        { duration: '2m', target: 0 }       // Reduzir para 0 VUs em 2 minutos
      ],
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
    'http_req_duration{scenario:stress}': [
      // 99% das requisições no cenário de estresse devem responder em até 1s
      'p(99)<1000'
    ],
    'http_req_failed{scenario:stress}': [
      // Máximo de 5% de falhas no cenário de estresse
      'rate<0.05'
    ]
  },
};