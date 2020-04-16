/*
 * @Description: 定时器hooks
 * @Author: longzhang6
 * @Date: 2020-04-16 22:17:16
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-16 22:42:01
 */
import { useEffect, useRef } from 'react'

const useInterval = (callback, delay, send) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null && send) {
      let timer = setInterval(tick, delay)

      return () => {
        clearInterval(timer)
      }
    }
  }, [delay, send])
}

export default useInterval
