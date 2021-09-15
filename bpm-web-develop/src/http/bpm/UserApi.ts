import ApiClient from "@/http/ApiClient";

export default class UserApi {
  /**
   * 流程定义列表
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/identity/user/query`, body)
      .then(res => {
        return res.data;
      });
  }
}
