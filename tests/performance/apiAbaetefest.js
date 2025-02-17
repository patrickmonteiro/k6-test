// test.js
import http from 'k6/http';
import { sleep, check } from 'k6';
import { group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 10,
    duration: '15s',
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% das requisições devem completar em menos de 500ms
        'http_req_failed': ['rate<0.01'],  // menos de 1% das requisições podem falhar
    }
};

export default function () {
    group('Lista de eventos', () => {
        const response = http.get('https://polished-snowflake-9723.fly.dev/api/events');
        
        check(response, {
            'status is 200': (r) => r.status === 200,
            'response time < 500ms': (r) => r.timings.duration < 500,
        });
    });

    sleep(1);

    group('Lista de pontos turísticos', () => {
      const response = http.get('https://polished-snowflake-9723.fly.dev/api/attractions');
      
      check(response, {
          'status is 200': (r) => r.status === 200,
          'response time < 500ms': (r) => r.timings.duration < 500,
      });
    });
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data, { 
            title: 'Teste de Performance 10 usuários por 15s',
            configurations: {
                summaryTimeUnit: 'ms', // Unidade de tempo em milissegundos
                summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)'],
            },
        }),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}