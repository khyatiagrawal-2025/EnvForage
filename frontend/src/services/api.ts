import { Profile, ScriptGenerationRequest, ScriptGenerationResponse, DiagnosticReport, DiagnosticResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  getProfiles: async (os?: string, cuda?: boolean, tags?: string[]): Promise<Profile[]> => {
    const params = new URLSearchParams();
    if (os) params.append('os', os);
    if (cuda !== undefined) params.append('cuda', cuda.toString());
    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag));
    }

    const url = `${API_BASE_URL}/profiles${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  },

  getProfile: async (slug: string): Promise<Profile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${slug}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to fetch profile: ${slug}`);
    return response.json();
  },

  generateScript: async (request: ScriptGenerationRequest): Promise<ScriptGenerationResponse> => {
    const response = await fetch(`${API_BASE_URL}/scripts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to generate script');
    return response.json();
  },

  diagnose: async (report: DiagnosticReport, profileId?: string): Promise<DiagnosticResponse> => {
    const url = profileId ? `${API_BASE_URL}/diagnose?profile_id=${profileId}` : `${API_BASE_URL}/diagnose`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });
    if (!response.ok) throw new Error('Failed to analyze diagnostic report');
    return response.json();
  }
};
