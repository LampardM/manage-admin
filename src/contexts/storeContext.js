/*
 * @Description: mobx状态管理Context
 * @Author: longzhang6
 * @Date: 2020-04-15 19:11:10
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-15 19:12:32
 */
import { createContext } from "react";
import { store } from "@/store";

export const storeContext = createContext(store);
