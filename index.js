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

// Add this function to your existing index.js
const initializeSkillBars = () => {
    document.querySelectorAll('.skill-item').forEach(item => {
        const percentageElement = item.querySelector('.skill-percentage');
        const progressBar = item.querySelector('.progress');
        
        if (percentageElement && progressBar) {
            const percentage = percentageElement.textContent;
            progressBar.style.width = percentage;
        }
    });
};

// Add these functions to your existing index.js
const handleScroll = () => {
    const scrollButton = document.getElementById('scroll-to-top');
    if (!scrollButton) {
        console.error('Scroll button not found!');
        return;
    }
    
    console.log('Current scroll position:', window.scrollY); // Debug log
    
    if (window.scrollY > 300) {
        scrollButton.classList.add('visible');
        console.log('Button should be visible'); // Debug log
    } else {
        scrollButton.classList.remove('visible');
        console.log('Button should be hidden'); // Debug log
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Add these quotes array and function to your existing index.js
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "Programming isn't about what you know; it's about what you can figure out. - Chris Pine"
];

let currentQuoteIndex = 0;

const cycleQuotes = () => {
    const quoteElement = document.getElementById('quote-cycler');
    if (!quoteElement) return;

    // Fade out
    quoteElement.style.opacity = '0';
    
    setTimeout(() => {
        // Update quote
        quoteElement.textContent = quotes[currentQuoteIndex];
        // Fade in
        quoteElement.style.opacity = '1';
        
        // Update index for next cycle
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    }, 500);
};

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    replaceTemplateVariables();
    fetchBalances();
    initializeSkillBars();
    
    // Add scroll to top functionality
    const scrollButton = document.getElementById('scroll-to-top');
    scrollButton.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll);

    // Start quote cycling
    cycleQuotes(); // Show first quote immediately
    setInterval(cycleQuotes, 5000); // Cycle every 5 seconds
}); 