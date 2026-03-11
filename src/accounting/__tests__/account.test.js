const {
    AccountDataStore,
    AccountOperations,
    AccountManagementSystem,
} = require('../index');

describe('AccountDataStore', () => {
    test('initial balance should be 1000.00', () => {
        const store = new AccountDataStore();
        expect(store.read()).toBe(1000.0);
    });

    test('write updates the balance', () => {
        const store = new AccountDataStore();
        store.write(123.45);
        expect(store.read()).toBe(123.45);
    });
});

describe('AccountOperations', () => {
    let store;
    let ops;

    beforeEach(() => {
        store = new AccountDataStore();
        ops = new AccountOperations(store);
    });

    test('view balance returns formatted string', () => {
        expect(ops.viewBalance()).toContain('Current balance: 0001000.00');
    });

    test('creditAccount with valid amount', () => {
        const result = ops.creditAccount(500);
        expect(result.success).toBe(true);
        expect(store.read()).toBeCloseTo(1500);
        expect(result.message).toContain('New balance: 0001500.00');
    });

    test('creditAccount refuses invalid amount', () => {
        const result = ops.creditAccount(-100);
        expect(result.success).toBe(false);
        expect(result.message).toMatch(/Invalid credit amount/);
        expect(store.read()).toBe(1000);
    });

    test('multiple credits accumulate correctly', () => {
        ops.creditAccount(250.5);
        ops.creditAccount(100.25);
        expect(store.read()).toBeCloseTo(1350.75);
    });

    test('debitAccount with sufficient funds', () => {
        const result = ops.debitAccount(200);
        expect(result.success).toBe(true);
        expect(store.read()).toBeCloseTo(800);
        expect(result.message).toContain('New balance: 0000800.00');
    });

    test('debitAccount rejects insufficient funds', () => {
        const result = ops.debitAccount(2000);
        expect(result.success).toBe(false);
        expect(result.message).toMatch(/Insufficient funds/);
        expect(store.read()).toBe(1000);
    });

    test('debitAccount allows exact balance', () => {
        const result = ops.debitAccount(1000);
        expect(result.success).toBe(true);
        expect(store.read()).toBeCloseTo(0);
    });

    test('debitAccount rejects zero or negative amounts', () => {
        let res = ops.debitAccount(0);
        expect(res.success).toBe(false);
        res = ops.debitAccount(-1);
        expect(res.success).toBe(false);
    });

    test('formatBalance maintains two decimal places and padding', () => {
        expect(ops.formatBalance(1)).toBe('0000001.00');
        // padStart(10) ensures minimum width of 10 characters
        expect(ops.formatBalance(12345.678)).toBe('0012345.68');
    });
});

describe('AccountManagementSystem', () => {
    let system;
    let consoleSpy;

    beforeEach(() => {
        system = new AccountManagementSystem();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('processMenuChoice returns false on exit', async () => {
        const cont = await system.processMenuChoice('4');
        expect(cont).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!');
    });

    test('processMenuChoice handles invalid choice', async () => {
        const cont = await system.processMenuChoice('5');
        expect(cont).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('processMenuChoice option 1 shows balance', async () => {
        const cont = await system.processMenuChoice('1');
        expect(cont).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith('Current balance: 0001000.00');
    });
});
