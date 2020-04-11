/*
 * @Description: 用户相关接口
 * @Author: longzhang6
 * @Date: 2020-04-11 17:40:46
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-11 17:47:19
 */
import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}
