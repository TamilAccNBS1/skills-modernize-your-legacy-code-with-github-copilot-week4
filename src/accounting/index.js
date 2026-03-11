#!/usr/bin/env node

const readline = require('readline');

/**
 * Student Account Management System - Node.js Port
 * 
 * This application is a modernized version of the original COBOL-based
 * account management system. It maintains data integrity and business logic
 * from the original implementation while providing a cleaner, maintainable codebase.
 */

// ============================================================================
// Data Storage Module (equivalent to data.cob)
// ============================================================================

class AccountDataStore {
    constructor() {
        this.balance = 1000.00;
    }

    /**
     * Read the current balance
     * @returns {number} Current balance
     */
    read() {
        return this.balance;
    }

    /**
     * Write a new balance to storage
     * @param {number} newBalance - The new balance value
     */
    write(newBalance) {
        this.balance = newBalance;
    }
}

// ============================================================================
// Operations Module (equivalent to operations.cob)
// ============================================================================

class AccountOperations {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }

    /**
     * View current balance (TOTAL operation)
     * @returns {string} Formatted balance display
     */
    viewBalance() {
        const balance = this.dataStore.read();
        return `Current balance: ${this.formatBalance(balance)}`;
    }

    /**
     * Credit account with specified amount
     * @param {number} amount - Amount to credit
     * @returns {object} Operation result with status and message
     */
    creditAccount(amount) {
        if (isNaN(amount) || amount <= 0) {
            return {
                success: false,
                message: 'Invalid credit amount. Please enter a positive number.'
            };
        }

        const currentBalance = this.dataStore.read();
        const newBalance = currentBalance + amount;
        this.dataStore.write(newBalance);

        return {
            success: true,
            message: `Amount credited. New balance: ${this.formatBalance(newBalance)}`
        };
    }

    /**
     * Debit account with specified amount
     * @param {number} amount - Amount to debit
     * @returns {object} Operation result with status and message
     */
    debitAccount(amount) {
        if (isNaN(amount) || amount <= 0) {
            return {
                success: false,
                message: 'Invalid debit amount. Please enter a positive number.'
            };
        }

        const currentBalance = this.dataStore.read();

        if (currentBalance < amount) {
            return {
                success: false,
                message: 'Insufficient funds for this debit.'
            };
        }

        const newBalance = currentBalance - amount;
        this.dataStore.write(newBalance);

        return {
            success: true,
            message: `Amount debited. New balance: ${this.formatBalance(newBalance)}`
        };
    }

    /**
     * Format balance for display (matches COBOL output format)
     * @param {number} balance - Balance to format
     * @returns {string} Formatted balance string
     */
    formatBalance(balance) {
        return balance.toFixed(2).padStart(10, '0');
    }
}

// ============================================================================
// Main Application (equivalent to main.cob)
// ============================================================================

class AccountManagementSystem {
    constructor() {
        this.dataStore = new AccountDataStore();
        this.operations = new AccountOperations(this.dataStore);
        this.rl = null;
    }

    /**
     * Display the main menu
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
        console.log('Enter your choice (1-4): ');
    }

    /**
     * Process menu selection
     * @param {string} choice - User's menu selection
     * @returns {Promise<boolean>} Returns false to exit, true to continue
     */
    async processMenuChoice(choice) {
        switch (choice.trim()) {
            case '1':
                console.log(this.operations.viewBalance());
                return true;

            case '2':
                return await this.handleCreditOperation();

            case '3':
                return await this.handleDebitOperation();

            case '4':
                console.log('Exiting the program. Goodbye!');
                return false;

            default:
                console.log('Invalid choice, please select 1-4.');
                return true;
        }
    }

    /**
     * Handle credit account operation
     * @returns {Promise<boolean>} Returns true to continue
     */
    async handleCreditOperation() {
        const amount = await this.promptForAmount('Enter credit amount: ');
        const result = this.operations.creditAccount(parseFloat(amount));
        console.log(result.message);
        return true;
    }

    /**
     * Handle debit account operation
     * @returns {Promise<boolean>} Returns true to continue
     */
    async handleDebitOperation() {
        const amount = await this.promptForAmount('Enter debit amount: ');
        const result = this.operations.debitAccount(parseFloat(amount));
        console.log(result.message);
        return true;
    }

    /**
     * Prompt user for an amount
     * @param {string} prompt - Prompt message
     * @returns {Promise<string>} User input
     */
    promptForAmount(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }

    /**
     * Main application loop
     */
    async run() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let continueRunning = true;

        while (continueRunning) {
            this.displayMenu();
            const choice = await new Promise((resolve) => {
                this.rl.question('', (answer) => {
                    resolve(answer);
                });
            });

            continueRunning = await this.processMenuChoice(choice);
        }

        this.rl.close();
    }
}

// ============================================================================
// Entry Point
// ============================================================================

// allow this module to be required for testing
if (require.main === module) {
    const app = new AccountManagementSystem();
    app.run().catch((error) => {
        console.error('An error occurred:', error);
        process.exit(1);
    });
}

// exports for testing
module.exports = {
    AccountDataStore,
    AccountOperations,
    AccountManagementSystem
};
