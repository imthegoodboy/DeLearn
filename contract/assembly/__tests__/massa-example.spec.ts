import { Args, stringToBytes } from '@massalabs/as-types';
import { constructor, hello, PLATFORM_KEY } from '../contracts/main';
import { setDeployContext, Storage } from '@massalabs/massa-as-sdk';

const NAME = 'Massa DeAds Test';

describe('SC unit tests', () => {
  beforeAll(() => {
    setDeployContext();
    const args = new Args().add(NAME).serialize();
    // init contract
    constructor(args);
  });

  test('platform name is set', () => {
    const name = Storage.get(PLATFORM_KEY);
    expect(name).toBe(NAME);
  });

  test('say hello', () => {
    const expectedMessage = `Massa DeAds ready - ${NAME}`;
    const result = hello([]);
    expect(result).toStrictEqual(stringToBytes(expectedMessage));
  });
});
