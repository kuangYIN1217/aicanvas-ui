import { DeepThinkerUiPage } from './app.po';

describe('deep-thinker-ui App', () => {
  let page: DeepThinkerUiPage;

  beforeEach(() => {
    page = new DeepThinkerUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
