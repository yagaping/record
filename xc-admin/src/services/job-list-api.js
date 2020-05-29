import request from '../utils/request';

const MODULE_URL = '/scheduler-api';

export async function queryList( {index, body= {} } ) {
  return request(`${MODULE_URL}/scheduler/${index}`, {
    method: 'PATCH',
    body,
  });
}

export async function resumeJob({ jobName, jobGroup, triggerName, triggerGroup }) {
  return request(`${MODULE_URL}/scheduler/${jobName}/resume/${jobGroup}`, {
    method: 'PATCH',
    body: {
      triggerName,
      triggerGroup,
    },
  });
}

export async function pauseJob({ jobName, jobGroup }) {
  return request(`${MODULE_URL}/scheduler/${jobName}/pause/${jobGroup}`, {
    method: 'PATCH',
  });
}

export async function runJob({ jobName, body }) {
  return request(`${MODULE_URL}/scheduler/${jobName}/run`, {
    method: 'PATCH',
    body,
  });
}

export async function modifyJob({ body }) {
  return request(`${MODULE_URL}/scheduler`, {
    method: 'PUT',
    body,
  });
}

export async function addJob({ body }) {
  return request(`${MODULE_URL}/scheduler`, {
    method: 'POST',
    body,
  });
}

export async function removeJob({ jobName, jobGroup }) {
  return request(`${MODULE_URL}/scheduler/${jobName}/${jobGroup}`, {
    method: 'DELETE',
  });
}
