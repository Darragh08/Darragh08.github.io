// Import viem
import * as chains from 'https://esm.sh/viem/chains'
import { createPublicClient, http } from 'https://esm.sh/viem'
//import {mainnet} from "viem/chains"

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

// Move the balance check into async functions for each chain
const checkEthBalance = async () => {
    const balance = await ethereumClient.getBalance({
        address: "0x2C9107D73cE7be95A68De80f70003D38E81ce3f7"
    })
    console.log(`ETH balance:`, balance)
    return balance
}

const checkOpBalance = async () => {
    const balance = await optimismClient.getBalance({
        address: "0x2C9107D73cE7be95A68De80f70003D38E81ce3f7"
    })
    console.log(`Optimism balance:`, balance)
    return balance
}

const checkBaseBalance = async () => {
    const balance = await baseClient.getBalance({
        address: "0x2C9107D73cE7be95A68De80f70003D38E81ce3f7"
    })
    console.log(`Base balance:`, balance)
    return balance
}

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
    try {
        // Fetch all balances concurrently
        const [ethBalance, opBalance, baseBalance] = await Promise.all([
            checkEthBalance(),
            checkOpBalance(),
            checkBaseBalance()
        ])

        // Convert from Wei to ETH (divide by 10^18)
        templateVariables.ethBalance = (ethBalance / 10n ** 18n).toString()
        templateVariables.opBalance = (opBalance / 10n ** 18n).toString()
        templateVariables.baseBalance = (baseBalance / 10n ** 18n).toString()
        
        replaceTemplateVariables()
    } catch (error) {
        console.error('Error fetching balances:', error)
    }
}

// Run replacement when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    replaceTemplateVariables();
    fetchBalances(); // Now we can call fetchBalances here
}); 