import type { Exam } from '@/pages/exam';

// 获取考试列表
export const getExamList = async (params?: Record<string, any>): Promise<Exam[]> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/exams?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch exams');
  return response.json();
};

// 获取考试详情
export const getExamDetail = async (id: number): Promise<Exam> => {
  const response = await fetch(`/api/exams/${id}`);
  if (!response.ok) throw new Error('Failed to fetch exam detail');
  return response.json();
};

// 创建考试
export const createExam = async (data: Exam): Promise<Exam> => {
  const response = await fetch('/api/exams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) throw new Error('Failed to create exam');
  return response.json();
};

// 更新考试
export const updateExam = async (id: number, data: Partial<Exam>): Promise<Exam> => {
  const response = await fetch(`/api/exams/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) throw new Error('Failed to update exam');
  return response.json();
};

// 删除考试
export const deleteExam = async (id: number): Promise<void> => {
  const response = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete exam');
};

// 获取考场分布
export const getExamRooms = async (examId: number): Promise<any[]> => {
  const response = await fetch(`/api/exams/${examId}/rooms`);
  if (!response.ok) throw new Error('Failed to fetch exam rooms');
  return response.json();
};

// 分配考场
export const assignExamRooms = async (examId: number, data: any): Promise<void> => {
  const response = await fetch(`/api/exams/${examId}/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) throw new Error('Failed to assign exam rooms');
};

// 获取考生列表
export const getExamCandidates = async (examId: number, params?: Record<string, any>): Promise<any[]> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/exams/${examId}/candidates?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch exam candidates');
  return response.json();
};

// 导入考生
export const importExamCandidates = async (examId: number, data: FormData): Promise<void> => {
  const response = await fetch(`/api/exams/${examId}/candidates/import`, { method: 'POST', data });
  if (!response.ok) throw new Error('Failed to import exam candidates');
};

// 导出考生
export const exportExamCandidates = async (examId: number): Promise<void> => {
  const response = await fetch(`/api/exams/${examId}/candidates/export`, { method: 'GET' });
  if (!response.ok) throw new Error('Failed to export exam candidates');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `exam-candidates-${examId}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};