import request from '../../utils/request';

//账号列表
export async function addUser(params) {
  return request('/restful/user/sayhi', {
    method: 'POST',
    body: params,
  });
}

export async function queryUser(params) {
  return request('/restful/user/query',{
    method: 'POST',
    body: params,
  });
}

export async function removeUser(params) {
  return request('/restful/user/remove', {
    method: 'POST',
    body: {
      method: 'POST',
      ...params,
    },
  });
}

export async function editUser(params) {
  return request('/restful/user/modify', {
    method: 'POST',
    body: {
      method: 'POST',
      ...params,
    },
  });
}

export async function editUserState(params) {
  return request('/restful/user/prohibit', {
    method: 'POST',
    body: params,
  });
}

export async function resetPwd(params) {
  return request('/restful/user/OriginalPwd', {
    method: 'POST',
    body: params,
  });
}

//角色管理
export async function roleList(params) {
  return request('/restful/role/roleQuery', {
    method: 'POST',
    body: params,
  });
}

export async function addRole(params) {
  return request('/restful/role/roleSayhi', {
    method: 'POST',
    body: params,
  });
}

export async function editRole(params) {
  return request('/restful/role/roleModify', {
    method: 'POST',
    body: params,
  });
}

export async function roleRemove(params) {
  return request('/restful/role/roleRemove', {
    method: 'POST',
    body: params,
  });
}

export async function editRoleState(params) {
  return request('/restful/role/prohibit', {
    method: 'POST',
    body: params,
  });
}
//角色权限
export async function findPermission(params) {
  return request('/restful/role/findPermission', {
    method: 'POST',
    body: params,
  });
}
//所有角色
export async function queryRole(params) {
  return request('/restful/role/allRole', {
    method: 'POST',
    body: params,
  });
}

//菜单管理
export async function addParentMenu(params) {
  return request('/restful/menu/insertMenuItem', {
    method: 'POST',
    body: params,
  });
}

export async function addChildMenu(params) {
  return request('/restful/menu/insertChildMenuItem', {
    method: 'POST',
    body: params,
  });
}

export async function deleteParentMenu(params) {
  return request('/restful/menu/deleteParentMenuItem', {
    method: 'POST',
    body: params,
  });
}

export async function deleteChildMenu(params) {
  return request('/restful/menu/deleteChildMenuItem', {
    method: 'POST',
    body: params,
  });
}

export async function updateParentMenu(params) {
  return request('/restful/menu/updateParentMenuItem', {
    method: 'POST',
    body: params,
  });
}

export async function updateChildMenu(params) {
  return request('/restful/menu/updateChildMenuItem', {
    method: 'POST',
    body: params,
  });
}

//所有权限
export async function getAllPermission(params) {
  return request('/restful/permission/permissionQuery', {
    method: 'POST',
    body: params,
  });
}

//登入登出
export async function fakeAccountLogin(params) {
  return request('/restful/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function loginOut(params) {
  return request('/restful/user/logout', {
    method: 'POST',
    body: params,
  });
}
//修改密码
export async function revisePwd(params) {
  return request('/restful/user/revisePwd', {
    method: 'POST',
    body: params,
  });
}

export async function getCodeApi(params) {
  return request('/restful/user/mobile', {
    method: 'POST',
    body: params,
  });
}

export async function codeLoginApi(params) {
  return request('/restful/user/confirmLogin', {
    method: 'POST',
    body: params,
  });
}

