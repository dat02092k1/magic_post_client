import { action, persist, createStore, thunk } from 'easy-peasy';
import { getDepartmentById, getDepartments } from '../repository/department/department';
import { getUserById } from '../repository/user/user';

export const store = createStore({


  currentUser: persist({
    loggedIn: false,
    email: '',
    password: ''
  }, {
    storage: 'localStorage'
  }),
  setUserInfo: action((state, payload) => {
    state.currentUser = payload;
  }),
  removeState: action((state) => {
    state.currentUser = {
      loggedIn: false,
      email: '',
      password: ''
    };

  }),
  departments: [],
  setDepartments: action((state, departments) => {
    state.departments = departments;
  }),
  fetchDepartments: thunk(async (actions) => {
    try {
      const res = await getDepartments();
      console.log(res);
      actions.setDepartments(res.data.data.departments);
    } catch (error) {
      console.log(error);
    }
  }),
  fetchDepartmentById: thunk(async (actions, id) => {
    try {
      const res = await getDepartmentById(id);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  }),
  fetchUserById: thunk(async (actions, id) => {
    try {
      const res = await getUserById(id);
      console.log(res);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  })

});
