jest.mock('react-native-permissions', () => ({
  check: jest.fn().mockResolvedValue('GRANTED'),
  request: jest.fn(),
  openSettings: jest.fn(),
  PERMISSIONS: { IOS: { CONTACTS: 'CONTACTS' } },
  RESULTS: {
    DENIED: 'DENIED',
    BLOCKED: 'BLOCKED',
    UNAVAILABLE: 'UNAVAILABLE',
    GRANTED: 'GRANTED',
    LIMITED: 'LIMITED',
  },
}))
