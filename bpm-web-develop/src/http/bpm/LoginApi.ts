import ApiClient from "@/http/ApiClient";

export default class LoginApi {
  /**
   * 流程定义列表
   * @param body
   */
  static login(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/auth/login`, body)
      .then(res => {
        return res.data;
      });
  }
}
