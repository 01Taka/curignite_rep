export const getId = (taskId: string, categoryId: string) => `${taskId}/${categoryId}`;

export const recoveryId = (id: string) => {
  const match = id.match(/^([^/]+)\/([^/]+)$/);
  return match ? { taskId: match[1], categoryId: match[2] } : { taskId: '', categoryId: '' };
};

