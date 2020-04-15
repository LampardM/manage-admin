/*
 * @Description: mobx状态管理hooks
 * @Author: longzhang6
 * @Date: 2020-04-15 19:13:15
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-15 19:15:05
 */
import { useContext } from "react";
import { storeContext } from "@/contexts/storeContext";

const useStore = () => useContext(storeContext);

export { useStore };
