// --------------------------------------------------------------------------------
// List of options for the application.
// --------------------------------------------------------------------------------
import fs from 'fs';
import { Option } from '../types';

export default class ListOptions {
  /**
   * Default list of options for the command line application.
   */
  public static entries: Option[] = [
    {
      displayText: 'Debug',
      script: () => console.log('Nothing to debug at this time...')
    },
    {
      displayText: 'Web project setup',
      script: () => {
        const tempDir = fs.mkdtempSync('foobar_');
      }
    }
  ];

  /**
   * Returns all items in list.
   */
  public static get getAll(): Option[] {
    if (!Array.isArray(this.entries)) {
      return null;
    }
    return this.entries;
  }
}
