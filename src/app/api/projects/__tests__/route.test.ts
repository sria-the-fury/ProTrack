jest.mock('@/lib/firebase');
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(() => ({})),
    getDocs: jest.fn(() => Promise.resolve({ docs: [
        { id: '1', data: () => ({ name: 'Project 1' }) },
        { id: '2', data: () => ({ name: 'Project 2' }) },
    ]})),
    addDoc: jest.fn((col, data) => Promise.resolve({ id: 'mock-id' })),
    serverTimestamp: jest.fn(() => new Date()),
    query: jest.fn((c) => c),
    orderBy: jest.fn(),
}));

import { GET, POST } from '@/app/api/projects/route';
import { NextRequest } from 'next/server';

describe('/api/projects', () => {
  describe('GET', () => {
    it('should return a list of projects', async () => {
      const response = await GET();
      const projects = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(2);
    });
  });

  describe('POST', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'This is a test project',
        status: 'Not Started',
        dueDate: new Date().toISOString(),
      };
      
      const req = {
        json: () => Promise.resolve(projectData),
      } as unknown as NextRequest;

      const response = await POST(req);
      const project = await response.json();

      expect(response.status).toBe(201);
      expect(project.name).toBe('Test Project');
      expect(project).toHaveProperty('id');
    });
  });
});
