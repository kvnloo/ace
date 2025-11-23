import { describe, it, expect } from 'vitest';
import { View, type FeatureData, type ChatMessage } from './types';

describe('View enum', () => {
  it('should have all expected view types', () => {
    expect(View.HOME).toBe('HOME');
    expect(View.FACILITY_DEMO).toBe('FACILITY_DEMO');
    expect(View.AMENITIES).toBe('AMENITIES');
    expect(View.INVEST).toBe('INVEST');
    expect(View.SPECIFICATIONS).toBe('SPECIFICATIONS');
  });

  it('should have exactly 5 view types', () => {
    const viewKeys = Object.keys(View);
    expect(viewKeys).toHaveLength(5);
  });

  it('should have unique values for each view', () => {
    const viewValues = Object.values(View);
    const uniqueValues = new Set(viewValues);
    expect(uniqueValues.size).toBe(viewValues.length);
  });
});

describe('FeatureData interface', () => {
  it('should accept valid FeatureData object', () => {
    const feature: FeatureData = {
      id: 'test-id',
      title: 'Test Feature',
      description: 'Test description',
      icon: 'test-icon',
      position: [0, 0, 0],
    };

    expect(feature.id).toBe('test-id');
    expect(feature.title).toBe('Test Feature');
    expect(feature.description).toBe('Test description');
    expect(feature.icon).toBe('test-icon');
    expect(feature.position).toEqual([0, 0, 0]);
  });

  it('should handle position as tuple of three numbers', () => {
    const feature: FeatureData = {
      id: '1',
      title: 'Test',
      description: 'Desc',
      icon: 'icon',
      position: [1.5, 2.5, 3.5],
    };

    expect(feature.position).toHaveLength(3);
    expect(typeof feature.position[0]).toBe('number');
    expect(typeof feature.position[1]).toBe('number');
    expect(typeof feature.position[2]).toBe('number');
  });
});

describe('ChatMessage interface', () => {
  it('should accept user message', () => {
    const message: ChatMessage = {
      role: 'user',
      text: 'Hello, this is a test message',
    };

    expect(message.role).toBe('user');
    expect(message.text).toBe('Hello, this is a test message');
  });

  it('should accept model message', () => {
    const message: ChatMessage = {
      role: 'model',
      text: 'Response from model',
    };

    expect(message.role).toBe('model');
    expect(message.text).toBe('Response from model');
  });

  it('should only accept valid role values', () => {
    const userMessage: ChatMessage = { role: 'user', text: 'test' };
    const modelMessage: ChatMessage = { role: 'model', text: 'test' };

    expect(['user', 'model']).toContain(userMessage.role);
    expect(['user', 'model']).toContain(modelMessage.role);
  });
});
