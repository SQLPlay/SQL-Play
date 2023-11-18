import {by, element, expect, waitFor, device} from 'detox';
import {tapOnId, tapOnText} from '../utils';
import '../init';

describe('Check lessons list', () => {
  it('go to learn tab', async () => {
    await tapOnText('Learn');
  });

  const scrollView = by.id('scroll-container');

  it('should have 5 free lessons', async () => {
    for (let i = 0; i < 5; i++) {
      const topicCard = element(by.id(`topic_card_${i}`));
      await expect(topicCard).toBeVisible();
      const topicChip = element(by.id(`lock_label_${i}`));
      await expect(topicChip).toHaveText('Free');
      await element(scrollView).scroll(350, 'down', NaN, 0.75);
    }
  });

  it('should have 11 paid lessons', async () => {
    // await element(scrollView).scroll(550, 'down', NaN, 0.75);
    for (let i = 5; i < 17; i++) {
      const topicCard = element(by.id(`topic_card_${i}`));
      await waitFor(topicCard)
        .toBeVisible()
        .whileElement(scrollView)
        .scroll(360, 'down', NaN, 0.75);

      const topicChip = element(by.id(`lock_label_${i}`));
      // await expect(topicCard).toBeVisible();
      await expect(topicChip).toHaveText('Pro unlocks this');
    }
  });
});
