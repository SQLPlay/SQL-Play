import {by, element, expect, waitFor, device} from 'detox';
import {tapOnId, tapOnText} from '../utils';
import '../init';

describe('Navigate to support page', () => {
  it('should navigate to support tickets', async () => {
    await tapOnId('menu');
    await device.disableSynchronization();
    await tapOnText('Get Help');

    const newTicketBtn = element(by.text('New ticket'));
    await expect(newTicketBtn).toBeVisible();
    await newTicketBtn.tap();
    await device.enableSynchronization();
  });
});

const email = 'help@drowning.com';
const name = 'John Duck';

describe('Create a new ticket', () => {
  it('Should get error on empty message', async () => {
    await element(by.id('emailInput')).typeText(email);
    await element(by.id('name')).typeText(name);
    await element(by.id('submit')).tap();
    const errorMsg = element(by.text('Your message has an error'));
    await expect(errorMsg).toBeVisible();
  });
});
