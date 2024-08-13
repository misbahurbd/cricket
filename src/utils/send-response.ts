import { Response } from "express"
interface IJsonObj<T, M> {
  statusCode?: number
  success?: boolean
  message: string
  data: T
  meta?: M
}

export const sendResponse = <T, M>(res: Response, jsonObj: IJsonObj<T, M>) => {
  res.status(jsonObj.statusCode || 200).json({
    statusCode: jsonObj.statusCode || 200,
    success: jsonObj.success || true,
    ...jsonObj,
  })
}
