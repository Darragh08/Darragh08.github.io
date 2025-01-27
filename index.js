// Import viem
import * as chains from 'https://esm.sh/viem/chains'
import { createPublicClient, http } from 'https://esm.sh/viem'

console.log("Hello World!"); 

const optimism = chains.optimism
const base = chains.base
const mainnet = chains.mainnet

const optimismClient = createPublicClient({
    chain: optimism,
    transport: http()
})

const baseClient = createPublicClient({
    chain: base,
    transport: http()
})

const ethereumClient = createPublicClient({
    chain: mainnet,
    transport: http()
})

console.log({ optimismClient, baseClient, ethereumClient })

// Object to store all template variables
const templateVariables = {
    ethBalance: "0.0",
    opBalance: "0.0",
    baseBalance: "0.0"
};

// Function to replace template strings in HTML
const replaceTemplateVariables = () => {
    document.querySelectorAll('[data-template]').forEach(element => {
        const template = element.getAttribute('data-template');
        if (template in templateVariables) {
            element.textContent = templateVariables[template];
        }
    });
};

const fetchBalances = async () => {
    // Use viem to fetch balances...
    // Check documentation for viem here:
    // https://viem.sh/docs/actions/public/getBalance#getbalance

    // Then update the template variables with the balances
    // templateVariables.ethBalance = 1;
    // templateVariables.opBalance = 2;
    // templateVariables.baseBalance = 3;
    return replaceTemplateVariables();
}

// Run replacement when DOM is loaded
document.addEventListener('DOMContentLoaded', replaceTemplateVariables); 

// fetchBalances();