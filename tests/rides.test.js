import { describe, it, expect, vi, beforeEach } from 'vitest';

import { listAvailableRides } from '../src/services/rideService.js';

vi.mock('../src/models/index.js', () => ({
  Ride: {
    find: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 'ride1' }]) }))
  },
  Bid: {}
}));

describe('ride service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists available rides with geo filter', async () => {
    const rides = await listAvailableRides({ lng: -73.9, lat: 40.7, radiusKm: 5 });
    expect(rides[0].id).toBe('ride1');
  });
});
