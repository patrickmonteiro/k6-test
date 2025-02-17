import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { fail } from 'k6';

// Carrega dados de teste
const users = new SharedArray('users', function() {
    return JSON.parse(open('../data/users.json')); 
});

export default function loginScenario() {
    // Seleciona um usuário aleatório dos dados de teste
    const user = users[Math.floor(Math.random() * users.length)];
    
    // Faz uma requisição GET para a página inicial primeiro
    const response = http.get('https://test.k6.io/');
    check(response, {
        'status is 200': (r) => r.status === 200,
    });

    // Simulando um login na API de teste do K6
    const payload = JSON.stringify({
        username: user.email,
        password: user.password
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Usando a API pública de teste do K6
    const loginResponse = http.post('https://test.k6.io/', payload, params);

    // Verifica o resultado
    const checks = check(loginResponse, {
        'status is 200': (r) => r.status === 200,
        // 'page contains welcome message': (r) => r.body.includes('Welcome'),
    });

    if (!checks) {
        console.log(`Login Response: ${loginResponse.status}`);
        console.log(`Response Body: ${loginResponse.body}`);
        fail('login checks failed');
    }

    sleep(1);

    // Para fins de teste, retornamos um token simulado
    return 'test-token';
}