// Import viem
import * as chains from 'https://esm.sh/viem/chains'
import { createPublicClient, http } from 'https://esm.sh/viem'
//import {mainnet} from "viem/chains"
import { formatUnits } from 'https://esm.sh/viem'

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
    baseBalance: "0.0",
    ethPrice: "0.0 ETH (€0.00)"
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

// Add this function before fetchBalances
const fetchEthPrice = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur');
        const data = await response.json();
        return data.ethereum.eur;
    } catch (error) {
        console.error('Error fetching ETH price:', error);
        return 0;
    }
};

const fetchBalances = async () => {
    try {
        // Fetch all balances and ETH price concurrently
        const [ethBalance, opBalance, baseBalance, ethPrice] = await Promise.all([
            checkEthBalance(),
            checkOpBalance(),
            checkBaseBalance(),
            fetchEthPrice()
        ])

        // Convert from Wei to ETH maintaining full precision
        const formatExactEther = (balance) => {
            const whole = balance / 10n ** 18n
            const fraction = balance % 10n ** 18n
            const paddedFraction = fraction.toString().padStart(18, '0')
            return `${whole}.${paddedFraction}`
        }

        const ethInEther = formatExactEther(ethBalance)
        const opInEther = formatExactEther(opBalance)
        const baseInEther = formatExactEther(baseBalance)

        // Format balance with EUR conversion for each chain
        const formatWithEur = (amount) => `${amount} ETH (€${(Number(amount) * ethPrice).toFixed(2)})`

        templateVariables.ethBalance = formatWithEur(ethInEther)
        templateVariables.opBalance = formatWithEur(opInEther)
        templateVariables.baseBalance = formatWithEur(baseInEther)
        
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