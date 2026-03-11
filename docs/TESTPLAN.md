# Student Account Management System - Test Plan

This test plan covers the business logic and functionality of the COBOL-based student account management system. It serves as a validation document for business stakeholders and will guide the creation of unit and integration tests for the Node.js modernized version.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View Balance - Initial State | Application started; no transactions performed | 1. Launch application<br>2. Select menu option 1 (View Balance)<br>3. Observe displayed balance | Display current balance of 1000.00 (formatted as 001000.00) | | | Initial balance should be displayed correctly with proper formatting |
| TC-002 | Credit Account - Valid Amount | Application running; initial balance 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 500.00<br>3. Observe system response | Amount added to balance; new balance displayed as 1500.00; system returns to main menu | | | Credit operation should increase balance by the exact amount entered |
| TC-003 | Credit Account - Multiple Credits | Application running; balance after TC-002 is 1500.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 250.50<br>3. Confirm new balance<br>4. Select menu option 2 again<br>5. Enter amount: 100.25 | Balance updates to 1750.50 after first credit, then to 1850.75 after second credit; each credit correctly adds to running balance | | | Multiple sequential credits should accumulate correctly without loss of precision |
| TC-004 | Debit Account - Valid Amount (Sufficient Funds) | Application running; balance is 1850.75 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 250.00<br>3. Observe system response | Amount deducted from balance; new balance displayed as 1600.75; system returns to main menu | | | Debit operation should decrease balance when sufficient funds exist |
| TC-005 | Debit Account - Insufficient Funds | Application running; balance is 1600.75 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 2000.00<br>3. Observe system response | Error message displayed: "Insufficient funds for this debit."; balance remains unchanged at 1600.75; system returns to main menu | | | Debit should be rejected if requested amount exceeds current balance |
| TC-006 | Debit Account - Exact Balance Amount | Application running; balance is 1600.75 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1600.75<br>3. Observe system response | Amount deducted; new balance displayed as 0.00; system returns to main menu | | | Debit should succeed when requested amount equals current balance (edge case) |
| TC-007 | Debit Account - Zero Balance After Debit | Application running; balance is 0.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 0.01 | Error message displayed: "Insufficient funds for this debit."; balance remains at 0.00 | | | Debit should be rejected when account balance is zero |
| TC-008 | Menu Navigation - Valid Selection (1) | Application at main menu | 1. Select menu option 1 | View Balance operation executes successfully | | | Menu option 1 should trigger balance inquiry |
| TC-009 | Menu Navigation - Valid Selection (2) | Application at main menu | 1. Select menu option 2 | Credit Account operation prompts for amount | | | Menu option 2 should trigger credit operation |
| TC-010 | Menu Navigation - Valid Selection (3) | Application at main menu | 1. Select menu option 3 | Debit Account operation prompts for amount | | | Menu option 3 should trigger debit operation |
| TC-011 | Menu Navigation - Valid Selection (4) Exit | Application at main menu | 1. Select menu option 4 | Program displays "Exiting the program. Goodbye!" and terminates gracefully | | | Menu option 4 should cleanly exit the application |
| TC-012 | Menu Navigation - Invalid Selection (5) | Application at main menu | 1. Select menu option 5 | Error message displayed: "Invalid choice, please select 1-4."; menu redisplayed for re-entry | | | Invalid menu selection should be rejected and user prompted to retry |
| TC-013 | Menu Navigation - Invalid Selection (0) | Application at main menu | 1. Select menu option 0 | Error message displayed: "Invalid choice, please select 1-4."; menu redisplayed for re-entry | | | Invalid menu selection (0) should be rejected |
| TC-014 | Menu Navigation - Invalid Selection (Non-numeric) | Application at main menu | 1. Enter non-numeric input (e.g., 'A') | Error message or behavior undefined; system may hang or display unexpected result | | | Robustness: Non-numeric menu input handling is not explicitly defined |
| TC-015 | Balance Precision - Multiple Operations | Application running; initial balance 1000.00 | 1. Credit 100.50<br>2. Credit 50.25<br>3. Debit 75.33<br>4. View Balance | Balance should be: 1000.00 + 100.50 + 50.25 - 75.33 = 1075.42 | | | System should maintain decimal precision (2 places) across multiple operations |
| TC-016 | Credit Account - Large Amount | Application running; balance 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 999999.99 | Amount added; new balance displayed as 1000999.99 (or system overflow/limit reached) | | | Test boundary condition for maximum account balance |
| TC-017 | Debit Account - Penny Debit | Application running; balance 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 0.01<br>3. View new balance | Balance decreases by 0.01; new balance is 999.99 | | | System should correctly handle minimal debit amounts |
| TC-018 | Menu Loop - Extended Session | Application running | 1. Perform: Credit 100, Debit 50, View Balance, Credit 75<br>2. After 4th operation, system should return to menu and allow further operations<br>3. Select option 4 to exit | All operations execute in sequence; menu persists until exit is selected; application terminates cleanly on option 4 | | | Application should support continuous transaction processing until user chooses to exit |
| TC-019 | Credit Account - Non-numeric Amount Input | Credit operation prompts for amount | 1. Select menu option 2 (Credit Account)<br>2. Enter non-numeric input (e.g., 'ABC') | Behavior undefined; system may hang, accept input, or display error | | | Robustness: Non-numeric amount input handling is not explicitly defined |
| TC-020 | Debit Account - Non-numeric Amount Input | Debit operation prompts for amount | 1. Select menu option 3 (Debit Account)<br>2. Enter non-numeric input (e.g., 'XYZ') | Behavior undefined; system may hang, accept input, or display error | | | Robustness: Non-numeric amount input handling is not explicitly defined |

---

## Test Execution Notes

### Scope
This test plan covers the following functional areas:
- **Menu Navigation**: User interface and option selection
- **Balance Inquiry**: Viewing current account balance
- **Credit Operations**: Adding funds to the account
- **Debit Operations**: Withdrawing funds with validation
- **Business Rules**: Insufficient funds prevention, decimal precision, state persistence within session

### Known Limitations & Gaps
1. **Input Validation**: The current COBOL application has minimal validation for non-numeric inputs. Tests TC-014, TC-019, and TC-020 document undefined behavior.
2. **Persistence**: Balance persists only during a session; no permanent storage mechanism is implemented.
3. **Error Handling**: Limited error recovery mechanisms; invalid inputs may cause unexpected behavior.
4. **Concurrent Access**: Single-user only; no concurrency or multi-session considerations.

### Recommendations for Node.js Modernization
1. Implement robust input validation and error handling for all user inputs
2. Add persistent storage (database) for account data
3. Implement comprehensive logging and audit trails for all transactions
4. Add role-based access control (e.g., distinguish between students, administrators)
5. Create thorough unit and integration tests based on this test plan
6. Consider adding transaction reversal/rollback capabilities
7. Implement rate limiting and fraud detection mechanisms

---

## Test Plan Completion Status
- **Total Test Cases**: 20
- **Completed**: [To be filled during test execution]
- **Passed**: [To be filled during test execution]
- **Failed**: [To be filled during test execution]
- **Blocked**: [To be filled during test execution]
