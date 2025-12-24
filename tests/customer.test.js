import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerRideHistory,
  deleteCustomerAccount
} from '../src/controllers/customerController.js';
import { User } from '../src/models/User.js';

vi.mock('../src/models/User.js', () => {
  return {
    User: {
      findById: vi.fn(),
      findByIdAndUpdate: vi.fn(),
      findByIdAndDelete: vi.fn()
    }
  };
});

const createMockRes = () => {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
};

describe('Customer Controller', () => {
  const userId = '507f1f77bcf86cd799439011';
  const baseUser = {
    _id: userId,
    email: 'user@example.com',
    role: 'customer',
    profile: { name: 'Jane Doe', avatarUrl: 'https://example.com/avatar.png' },
    phone: '+1234567890'
  };

  const selectResolvedValue = (value) => ({ select: vi.fn().mockResolvedValue(value) });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCustomerProfile', () => {
    it('returns profile when user exists', async () => {
      User.findById.mockReturnValue(selectResolvedValue(baseUser));
      const req = { user: { id: userId } };
      const res = createMockRes();

      await getCustomerProfile(req, res, vi.fn());

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(baseUser);
    });

    it('returns 404 when user missing', async () => {
      User.findById.mockReturnValue(selectResolvedValue(null));
      const req = { user: { id: userId } };
      const res = createMockRes();

      await getCustomerProfile(req, res, vi.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Customer not found' });
    });
  });

  describe('updateCustomerProfile', () => {
    it('updates customer profile data', async () => {
      const updated = {
        ...baseUser,
        profile: { name: 'John Doe', avatarUrl: 'avatar.jpg' },
        phone: '+111111111'
      };
      User.findByIdAndUpdate.mockReturnValue(selectResolvedValue(updated));

      const req = {
        user: { id: userId },
        body: { name: 'John Doe', avatarUrl: 'avatar.jpg', phone: '+111111111' }
      };
      const res = createMockRes();

      await updateCustomerProfile(req, res, vi.fn());

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        {
          phone: '+111111111',
          'profile.name': 'John Doe',
          'profile.avatarUrl': 'avatar.jpg'
        },
        { new: true, runValidators: true }
      );
      expect(res.body).toEqual(updated);
    });

    it('returns 404 when update target missing', async () => {
      User.findByIdAndUpdate.mockReturnValue(selectResolvedValue(null));
      const req = { user: { id: userId }, body: {} };
      const res = createMockRes();

      await updateCustomerProfile(req, res, vi.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Customer not found' });
    });
  });

  describe('getCustomerRideHistory', () => {
    it('returns empty ride history when user exists', async () => {
      User.findById.mockReturnValue(selectResolvedValue(baseUser));
      const req = { user: { id: userId } };
      const res = createMockRes();

      await getCustomerRideHistory(req, res, vi.fn());

      expect(res.body).toEqual({ userId, rides: [] });
    });

    it('returns 404 when user missing', async () => {
      User.findById.mockReturnValue(selectResolvedValue(null));
      const req = { user: { id: userId } };
      const res = createMockRes();

      await getCustomerRideHistory(req, res, vi.fn());

      expect(res.statusCode).toBe(404);
    });
  });

  describe('deleteCustomerAccount', () => {
    it('deletes account and returns confirmation', async () => {
      User.findByIdAndDelete.mockResolvedValue(baseUser);
      const req = { user: { id: userId } };
      const res = createMockRes();

      await deleteCustomerAccount(req, res, vi.fn());

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(res.body).toEqual({ message: 'Account deleted successfully' });
    });

    it('returns 404 when delete target missing', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);
      const req = { user: { id: userId } };
      const res = createMockRes();

      await deleteCustomerAccount(req, res, vi.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Customer not found' });
    });
  });
});
