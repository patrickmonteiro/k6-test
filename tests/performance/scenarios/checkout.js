import http from 'k6/http';
import { check, sleep } from 'k6';
import { fail } from 'k6';
import loginScenario from './login.js';

export default function checkoutScenario() {
    // Primeiro faz login para obter o token
    const authToken = loginScenario();

    // Configuração comum para todas as requisições
    const params = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };

    // Adiciona produto ao carrinho
    const addToCartResponse = http.post(
        'https://test.k6.io/my_messages.php',
        JSON.stringify({
            productId: 'P123',
            quantity: 1
        }),
        params
    );

    check(addToCartResponse, {
        'product added to cart': (r) => r.status === 200,
        'cart updated successfully': (r) => r.json('cartTotal') > 0
    });

    sleep(2); // Simula usuário revisando o carrinho

    // Obtém dados do carrinho
    const cartResponse = http.get('https://test.k6.io/cart', params);
    check(cartResponse, {
        'cart retrieved': (r) => r.status === 200,
        'cart has items': (r) => r.json('items').length > 0
    });

    sleep(1);

    // Inicia checkout
    const checkoutResponse = http.post(
        'https://test.k6.io/checkout',
        JSON.stringify({
            paymentMethod: 'credit_card',
            shippingAddress: {
                street: '123 Test St',
                city: 'Test City',
                country: 'Test Country',
                postalCode: '12345'
            },
            billingAddress: {
                street: '123 Test St',
                city: 'Test City',
                country: 'Test Country',
                postalCode: '12345'
            }
        }),
        params
    );

    // Verifica resultado do checkout
    if (!check(checkoutResponse, {
        'checkout successful': (r) => r.status === 200,
        'order confirmation received': (r) => r.json('orderId') !== '',
    })) {
        fail('checkout failed');
    }

    sleep(2); // Simula tempo de processamento do pagamento

    // Verifica status do pedido
    const orderResponse = http.get(
        `https://test.k6.io/orders/${checkoutResponse.json('orderId')}`,
        params
    );

    check(orderResponse, {
        'order status retrieved': (r) => r.status === 200,
        'order status is processing': (r) => r.json('status') === 'processing'
    });
}