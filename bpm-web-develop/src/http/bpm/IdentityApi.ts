import ApiClient from "@/http/ApiClient";

export default class IdentityApi {
  /**
   * 流程定义列表
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/identity/query`, body)
      .then(res => {
        return res.data;
      });
  }
}
