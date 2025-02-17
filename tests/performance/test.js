import { group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";
import { options } from './config.js';
import loginScenario from './scenarios/login.js';
// import checkoutScenario from './scenarios/checkout.js';

export { options };

export default function() {
    group('Login Flow', () => {
        loginScenario();
    });

    // group('Checkout Flow', () => {
    //     checkoutScenario();
    // });
}

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
}