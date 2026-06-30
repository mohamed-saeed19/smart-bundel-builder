import type {
  Draft,
  Part,
  SaveBuildPayload,
  SaveDraftPayload,
  SavedBuild,
} from '../types';

const API_BASE = 'http://localhost:3001';

export const fetchParts = async (): Promise<Part[]> => {
  const res = await fetch(`${API_BASE}/parts`);
  if (!res.ok) throw new Error('Failed to fetch parts');
  return res.json();
};

export const fetchPartById = async (id: string): Promise<Part> => {
  const res = await fetch(`${API_BASE}/parts/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch part ${id}`);
  return res.json();
};

export const saveBuild = async (build: SaveBuildPayload): Promise<SavedBuild> => {
  const res = await fetch(`${API_BASE}/builds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...build,
      createdAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error('Failed to save build');
  return res.json();
};

export const getBuilds = async (): Promise<SavedBuild[]> => {
  const res = await fetch(`${API_BASE}/builds`);
  if (!res.ok) throw new Error('Failed to fetch builds');
  return res.json();
};

export const getBuildById = async (id: string): Promise<SavedBuild> => {
  const res = await fetch(`${API_BASE}/builds/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch build ${id}`);
  return res.json();
};

export const updateBuild = async (
  id: string,
  build: Partial<SavedBuild>,
): Promise<SavedBuild> => {
  const res = await fetch(`${API_BASE}/builds/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(build),
  });
  if (!res.ok) throw new Error(`Failed to update build ${id}`);
  return res.json();
};

export const deleteBuild = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/builds/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete build ${id}`);
};

export const saveDraft = async (draft: SaveDraftPayload): Promise<Draft> => {
  const existingDraft = await getDraft();
  const url = existingDraft ? `${API_BASE}/drafts/${existingDraft.id}` : `${API_BASE}/drafts`;
  const method = existingDraft ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(existingDraft ? { id: existingDraft.id } : {}),
      ...draft,
      updatedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error('Failed to save draft');
  return res.json();
};

export const getDraft = async (): Promise<Draft | null> => {
  const res = await fetch(`${API_BASE}/drafts`);
  if (!res.ok) throw new Error('Failed to fetch drafts');
  const drafts = (await res.json()) as Draft[];
  return drafts[0] ?? null;
};

export const deleteDraft = async (): Promise<void> => {
  const existingDraft = await getDraft();
  if (!existingDraft) return;

  const res = await fetch(`${API_BASE}/drafts/${existingDraft.id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete draft');
};
