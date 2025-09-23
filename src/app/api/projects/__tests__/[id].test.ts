jest.mock('@/lib/firebase');
jest.mock('firebase/firestore', () => ({
    doc: jest.fn((db, col, id) => ({ id: id, path: `${col}/${id}` })),
    getDoc: jest.fn((docRef) => Promise.resolve({
        exists: () => true,
        id: docRef.id,
        data: () => ({ name: 'Test Project' }),
    })),
    updateDoc: jest.fn((docRef, data) => Promise.resolve({
        ...data,
    })),
    deleteDoc: jest.fn(() => Promise.resolve()),
    serverTimestamp: jest.fn(() => new Date()),
}));

import { GET, PUT, DELETE } from '@/app/api/projects/[id]/route';
import { NextRequest } from 'next/server';

describe('/api/projects/[id]', () => {
  const projectId = '123';

  describe('GET', () => {
    it('should return a single project', async () => {
      const response = await GET({} as NextRequest, { params: { id: projectId } });
      const project = await response.json();

      expect(response.status).toBe(200);
      expect(project.id).toBe(projectId);
    });
  });

  describe('PUT', () => {
    it('should update a project', async () => {
      const updatedData = { name: 'Updated Project' };
      const req = {
        json: () => Promise.resolve(updatedData),
      } as unknown as NextRequest;

      const response = await PUT(req, { params: { id: projectId } });
      const project = await response.json();

      expect(response.status).toBe(200);
      expect(project.name).toBe('Updated Project');
    });
  });

  describe('DELETE', () => {
    it('should delete a project', async () => {
      const response = await DELETE({} as NextRequest, { params: { id: projectId } });

      expect(response.status).toBe(204);
    });
  });
});
